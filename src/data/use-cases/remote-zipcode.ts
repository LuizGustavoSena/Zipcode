import { ErrorGetTracking } from "../../domain/error/error-get-tracking";
import { RequestGetZipcode, RequestInsertZipcode, ZipcodesParams } from "../../domain/models";
import { GraphQlGetTracking } from "../../domain/models/get-tracking";
import { GetZipcode, InsertZipcode } from "../../domain/use-cases";
import { BdClient } from "../protocols/bd";
import { HttpClient, HttpResponse, HttpStatusCode, MethodHttp } from "../protocols/http";

export class RemoteZipcode implements InsertZipcode, GetZipcode {
    constructor(
        private bdClient: BdClient,
        private httpClient: HttpClient
    ) { }

    async insertZipcode(params: RequestInsertZipcode): Promise<void> {
        this.bdClient.createZipcode(params);
    };

    async getZipcode(params: RequestGetZipcode): Promise<ZipcodesParams[]> {
        const zipCodes = await this.bdClient.getZipcode(params);

        if (!zipCodes || zipCodes.length === 0)
            return [];

        const promises = zipCodes?.map(el => {
            return this.httpClient.request<GraphQlGetTracking>({
                method: MethodHttp.POST,
                url: process.env.BASE_URL,
                body: this.makeQueryGraphQl(el)
            });
        });

        const response = await Promise.all(promises);

        if (response.find(el => el.statusCode !== HttpStatusCode.Ok))
            throw new ErrorGetTracking();

        return this.formatResponse(response);
    };

    private formatResponse(data: HttpResponse<GraphQlGetTracking>[]): ZipcodesParams[] {
        const zipcodes: ZipcodesParams[] = [];

        data.forEach(el => {
            const formatData = el.body.data.result;

            const routes = formatData.trackingEvents.map(subEl => {
                return {
                    start: subEl.to,
                    end: subEl.from,
                    date: subEl.createdAt,
                    description: subEl.originalTitle
                }
            });

            zipcodes.push({
                code: formatData.trackingEvents[0].trackingCode,
                status: formatData.lastStatus,
                routes
            })
        })

        return zipcodes;
    }

    private makeQueryGraphQl(code: string) {
        return {
            query: `mutation searchParcel ($tracker: TrackerSearchInput!) {  
                result: searchParcel 
                (tracker: $tracker) {            
                    lastStatus    
                    trackingEvents {      
                        trackingCode      
                        createdAt      
                        originalTitle      
                        to      
                        from    
                    }  
                }
            }`,
            variables: {
                tracker: {
                    trackingCode: code,
                    type: "correios"
                }
            }
        };
    };
}
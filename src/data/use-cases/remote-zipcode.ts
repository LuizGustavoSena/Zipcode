import { DeleteZipcodeError } from "../../domain/error/delete-zipcode-error";
import { ErrorGetTracking } from "../../domain/error/error-get-tracking";
import { RequestGetZipcode, RequestInsertZipcode, ZipcodesParams } from "../../domain/models";
import { ModelDeleteZipcode } from "../../domain/models/delete-zipcode";
import { GraphQlGetTracking } from "../../domain/models/get-tracking";
import { GetZipcode, InsertZipcode } from "../../domain/use-cases";
import { DeleteZipcode } from "../../domain/use-cases/delete-zipcode";
import { BdClient } from "../protocols/bd";
import { HttpClient, HttpStatusCode, MethodHttp } from "../protocols/http";

export class RemoteZipcode implements InsertZipcode, GetZipcode, DeleteZipcode {
    constructor(
        private bdClient: BdClient,
        private httpClient: HttpClient
    ) { }

    async insertZipcode(params: RequestInsertZipcode): Promise<void> {
        this.bdClient.createZipcode(params);
    };

    async deleteZipcode(params: ModelDeleteZipcode): Promise<void> {
        const response = await this.bdClient.deleteZipcode(params);

        if (response === null)
            throw new DeleteZipcodeError();
    };

    async getZipcode(params: RequestGetZipcode): Promise<ZipcodesParams[]> {
        const zipCodes = await this.bdClient.getZipcode(params);

        if (!zipCodes)
            return [];

        const promises = zipCodes.map(el => {
            return this.httpClient.request<GraphQlGetTracking>({
                method: MethodHttp.POST,
                url: String(process.env.BASE_URL),
                body: this.makeQueryGraphQl(el.zipcode)
            });
        });

        const response = await Promise.all(promises);

        if (response.find(el => el.statusCode !== HttpStatusCode.Ok || !el.body?.data))
            throw new ErrorGetTracking();

        const trackings = response.map(el => {
            if (!el.body || !el.body.data || !el.body.data.result)
                return;

            const data = el.body.data.result;

            const routes = data.trackingEvents.map(subEl => {
                return {
                    start: this.removeUnnecessaryText(subEl.to),
                    end: this.removeUnnecessaryText(subEl.from),
                    date: subEl.createdAt,
                    description: subEl.originalTitle
                }
            });

            return {
                name: zipCodes.find(el => el.zipcode === data.trackingEvents[0].trackingCode).name,
                code: data.trackingEvents[0].trackingCode,
                status: data.lastStatus,
                routes
            }
        });

        return trackings;
    };

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

    private removeUnnecessaryText(message: string): string {
        if (!message)
            return null;

        const wordsRemove = [
            'Unidade de Distribuição - ',
            'Unidade de Tratamento - ',
            'Unidade de Logística Integrada - ',
        ];

        let formatMessage = message;

        wordsRemove.forEach(el => {
            formatMessage = formatMessage.replace(el, '');
        });

        return formatMessage;
    }
}
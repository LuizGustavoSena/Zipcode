import moment from "moment";
import { ErrorGetTracking } from "../../domain/error/error-get-tracking";
import { GetzipcodesParsms, RequestGetZipcode, RequestInsertZipcode, ZipcodesParams } from "../../domain/models";
import { ModelDeleteZipcode } from "../../domain/models/delete-zipcode";
import { TrackProps } from "../../domain/models/get-tracking";
import { GetZipcode, InsertZipcode } from "../../domain/use-cases";
import { DeleteZipcode } from "../../domain/use-cases/delete-zipcode";
import { GetTrackingZipcode } from "../../domain/use-cases/get-tracking-zipcode";
import { env } from "../../infra/zod/env";
import { BdClient } from "../protocols/bd";
import { GuidClient } from "../protocols/guid";
import { HttpClient, MethodHttp } from "../protocols/http";

export class RemoteZipcode implements InsertZipcode, GetZipcode, DeleteZipcode, GetTrackingZipcode {
    constructor(
        private bdClient: BdClient,
        private httpClient: HttpClient,
        private guid: GuidClient
    ) { }

    insertZipcode = async (params: RequestInsertZipcode): Promise<void> => {
        this.bdClient.createZipcode({
            ...params,
            id: this.guid.generate()
        });
    };

    deleteZipcode = async (params: ModelDeleteZipcode): Promise<void> => {
        await this.bdClient.deleteZipcode(params);
    };

    getZipcode = async (params: RequestGetZipcode): Promise<GetzipcodesParsms[]> => {
        const zipCodes = await this.bdClient.getZipcode(params);

        return zipCodes;
    };

    getTrackingByZipcode = async (zipcode: string): Promise<ZipcodesParams> => {
        try {
            const response = await this.httpClient.request<TrackProps>({
                method: MethodHttp.GET,
                url: `${env.BASE_URL}&tracking_code=${zipcode}`,
                headers: {
                    'x-rapidapi-host': env.XRAPIDAPIHOST,
                    'x-rapidapi-key': env.XRAPIDAPIKEY
                }
            });

            if (!response?.body?.correios_object)
                throw new Error();

            const routes = response.body.correios_object.eventos.map(events => {
                return {
                    start: events?.unidade?.endereco?.cidade,
                    end: events?.unidadeDestino?.endereco?.cidade,
                    date: moment(events?.dtHrCriado?.date).format('DD/MM/YYYY HH:mm'),
                    description: events?.descricao
                }
            })

            return {
                code: zipcode,
                routes
            }
        } catch (error) {
            throw new ErrorGetTracking();
        }
    }
}
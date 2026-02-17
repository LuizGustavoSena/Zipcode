import moment from "moment";
import { DeleteZipcodeError } from "../../domain/error/delete-zipcode-error";
import { ErrorGetTracking } from "../../domain/error/error-get-tracking";
import { RequestGetZipcode, RequestInsertZipcode, ZipcodesParams } from "../../domain/models";
import { ModelDeleteZipcode } from "../../domain/models/delete-zipcode";
import { TrackProps } from "../../domain/models/get-tracking";
import { GetZipcode, InsertZipcode } from "../../domain/use-cases";
import { DeleteZipcode } from "../../domain/use-cases/delete-zipcode";
import { env } from "../../infra/zod/env";
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
        const zipCodes = [{ zipcode: 'NN085351155BR', name: 'Teclado' }]; //await this.bdClient.getZipcode(params);

        console.log({ zipCodes })

        if (!zipCodes)
            return [];

        const promises = zipCodes.map(el => {
            return this.httpClient.request<TrackProps>({
                method: MethodHttp.GET,
                url: `${env.BASE_URL}&tracking_code=${el.zipcode}`,
                headers: {
                    'x-rapidapi-host': env.XRAPIDAPIHOST,
                    'x-rapidapi-key': env.XRAPIDAPIKEY
                }
            });
        });

        const response = await Promise.all(promises);

        console.log({ response })


        if (response.find(el => el.statusCode !== HttpStatusCode.Ok || !el.body))
            throw new ErrorGetTracking();

        const trackings = response.map(el => {
            if (!el.body || !el.body.correios_object || el.body.correios_object.eventos.length === 0)
                return;

            const routes = el.body.correios_object.eventos.map(events => {
                return {
                    start: events.unidade.endereco.cidade,
                    end: events.unidadeDestino.endereco.cidade,
                    date: moment(events.dtHrCriado.date).format('dd/MM/yyyy:HH:mm'),
                    description: events.descricao
                }
            });

            return {
                name: zipCodes.find(subEl => subEl.zipcode === el.body.tracking_code).name,
                code: el.body.tracking_code,
                routes
            }
        });

        return trackings;
    };
}
import { ResponseFormatter } from '../../interfaces/response.interface';

export class ResponseSuccess implements ResponseFormatter {
    constructor(infoMessage: string, data?: any, notLog?: boolean) {
        this.success = true;
        this.message = infoMessage;
        this.data = data;

        if (!notLog) {
            try {
                const offuscateRequest = JSON.parse(JSON.stringify(data));
                if (offuscateRequest && offuscateRequest.token) {
                    offuscateRequest.token = '*******';
                }
                // console.log(new Date().toString() + ' - [Response]: ' + JSON.stringify(offuscateRequest))
            } catch (error) {}
        }
    }

    message: string;

    data: any[];

    errorMessage: any;

    error: any;

    success: boolean;

    errCode: number;
}

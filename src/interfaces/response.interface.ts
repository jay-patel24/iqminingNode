export interface ResponseFormatter {
    success: boolean;
    message: any;
    errorMessage: string;
    data: any[];
    error: any;
    errCode: number;
}

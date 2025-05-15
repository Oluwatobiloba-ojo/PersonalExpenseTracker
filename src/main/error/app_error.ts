export class AppError extends Error{
    public statusCode: number;

    constructor(message: any, statusCode: number){
        super(message);
        this.statusCode = statusCode;
    }

}
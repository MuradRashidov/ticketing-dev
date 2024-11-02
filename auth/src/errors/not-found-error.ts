import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = 404;
    constructor() {
        super('this route was not defined');
        Object.setPrototypeOf(this,NotFoundError.prototype)
    }
    serializeErrors() {
        return [{message:"Route not found"}]
    }

}
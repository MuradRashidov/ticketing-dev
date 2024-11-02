import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    reason = 'Error connecting to database';
    public statusCode = 500;
    constructor() {
        super("Error connected to db");
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
    serializeErrors (){
        return [{message:this.reason}]
    }
} 
import { ErrorCode, httpException } from './root';

export class BadRequestException extends httpException {
    constructor(message: string, errorCode: ErrorCode) {
        super(message,errorCode, 400, null);
    }
}
 
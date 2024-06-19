import { ErrorCode, httpException } from './root';

export class NotFoundException extends httpException {
    constructor(message: string, errorCode: ErrorCode) {
        super(message,errorCode, 404, null);
    }
}
 
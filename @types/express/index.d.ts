import { UserDocument } from "../../source/api/models/User.model";

declare global {
    namespace Express {
        interface Request {
            currentUser: UserDocument;
        }
    }
}

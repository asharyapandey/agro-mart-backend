import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmail, isEmpty } from "../utilities/validationFunctions";

export const userValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("phoneNumber")) {
        if (isEmpty(data?.phoneNumber)) {
            error.status = true;
            error.message = label.auth.validation("Phone Number");
        }
    } else {
        error.status = true;
        error.message = label.auth.validation("Phone Number");
    }

    if (data.hasOwnProperty("fullName")) {
        if (isEmpty(data?.fullName)) {
            error.status = true;
            error.message = label.auth.validation("Full Name");
        }
    } else {
        error.status = true;
        error.message = label.auth.validation("Full Name");
    }

    if (data.hasOwnProperty("permissionLevel")) {
        if (isEmpty(data?.permissionLevel)) {
            error.status = true;
            error.message = label.auth.validation("Permission Level");
        }
    } else {
        error.status = true;
        error.message = label.auth.validation("Permission Level");
    }
    if (data.hasOwnProperty("password")) {
        if (isEmpty(data?.password)) {
            error.status = true;
            error.message = label.auth.validation("password");
        }
    } else {
        error.status = true;
        error.message = label.auth.validation("Password");
    }
    return error;
};

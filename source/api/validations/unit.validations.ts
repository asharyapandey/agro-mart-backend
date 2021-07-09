import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmail, isEmpty } from "../utilities/validationFunctions";

export const unitValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("unit")) {
        if (isEmpty(data?.unit)) {
            error.status = true;
            error.message = label.unit.validation("Unit");
        }
    } else {
        error.status = true;
        error.message = label.unit.validation("Unit");
    }

    if (data.hasOwnProperty("displayName")) {
        if (isEmpty(data?.displayName)) {
            error.status = true;
            error.message = label.unit.validation("Display Name");
        }
    } else {
        error.status = true;
        error.message = label.unit.validation("Display Name");
    }
    return error;
};

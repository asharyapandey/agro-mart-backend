import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmail, isEmpty } from "../utilities/validationFunctions";

export const categoryValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("category")) {
        if (isEmpty(data?.category)) {
            error.status = true;
            error.message = label.category.validation("Category");
        }
    } else {
        error.status = true;
        error.message = label.category.validation("Category");
    }

    if (data.hasOwnProperty("displayName")) {
        if (isEmpty(data?.displayName)) {
            error.status = true;
            error.message = label.category.validation("Display Name");
        }
    } else {
        error.status = true;
        error.message = label.category.validation("Display Name");
    }

    if (data.hasOwnProperty("slug")) {
        if (isEmpty(data?.slug)) {
            error.status = true;
            error.message = label.category.validation("Slug");
        }
    } else {
        error.status = true;
        error.message = label.category.validation("Slug");
    }
    return error;
};

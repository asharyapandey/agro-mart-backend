import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmail, isEmpty } from "../utilities/validationFunctions";

export const productValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("productName")) {
        if (isEmpty(data?.productName)) {
            error.status = true;
            error.message = label.product.validation("Product Name");
        }
    } else {
        error.status = true;
        error.message = label.product.validation("productName");
    }

    if (data.hasOwnProperty("category")) {
        if (isEmpty(data?.category)) {
            error.status = true;
            error.message = label.product.validation("Category");
        }
    } else {
        error.status = true;
        error.message = label.product.validation("Category");
    }

    if (data.hasOwnProperty("unit")) {
        if (isEmpty(data?.unit)) {
            error.status = true;
            error.message = label.product.validation("Unit");
        }
    } else {
        error.status = true;
        error.message = label.product.validation("Unit");
    }

    if (data.hasOwnProperty("kalimatiPrice")) {
        if (isEmpty(data?.kalimatiPrice)) {
            error.status = true;
            error.message = label.product.validation("Kalimati Price");
        }
    } else {
        error.status = true;
        error.message = label.product.validation("Kalimati Price");
    }
    if (data.hasOwnProperty("slug")) {
        if (isEmpty(data?.slug)) {
            error.status = true;
            error.message = label.product.validation("Slug");
        }
    } else {
        error.status = true;
        error.message = label.product.validation("Slug");
    }
    return error;
};

import label from "../label/label";
import { ErrorType } from "../types/interfaces";
import { isEmail, isEmpty } from "../utilities/validationFunctions";

export const postValidation = (data: any): ErrorType => {
    let error: ErrorType = {
        status: false,
        message: "",
    };

    if (data.hasOwnProperty("product")) {
        if (isEmpty(data?.product)) {
            error.status = true;
            error.message = label.post.validation("Product");
        }
    } else {
        error.status = true;
        error.message = label.post.validation("Product");
    }

    if (data.hasOwnProperty("name")) {
        if (isEmpty(data?.name)) {
            error.status = true;
            error.message = label.post.validation("Name");
        }
    } else {
        error.status = true;
        error.message = label.post.validation("Name");
    }

    if (data.hasOwnProperty("address")) {
        if (isEmpty(data?.address)) {
            error.status = true;
            error.message = label.post.validation("Address");
        }
    } else {
        error.status = true;
        error.message = label.post.validation("Address");
    }

    if (data.hasOwnProperty("farmerPrice")) {
        if (isEmpty(data?.farmerPrice)) {
            error.status = true;
            error.message = label.post.validation("Farmer Price");
        }
    } else {
        error.status = true;
        error.message = label.post.validation("Farmer Price");
    }
    if (data.hasOwnProperty("image")) {
        if (isEmpty(data?.image)) {
            error.status = true;
            error.message = label.post.validation("Image");
        }
    } else {
        error.status = true;
        error.message = label.post.validation("Image");
    }
    return error;
};

import {
    NUMBER_REGEX,
    STRING_REGEX,
    EMAIL_REGEX,
    PHONE_REGEX,
} from "../constants/regex";

export const isEmpty = (value: any): boolean =>
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);

export const isString = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue?.toString()?.length === 0) {
        return false;
    } else if (STRING_REGEX.test(trimmedValue)) {
        return true;
    } else {
        return false;
    }
};

export const isNumber = (value: number): boolean => {
    const trimmedValue = value?.toString()?.trim();
    if (trimmedValue?.length === 0) {
        return false;
    } else if (NUMBER_REGEX.test(trimmedValue)) {
        return true;
    } else {
        return false;
    }
};

export const isEmail = (value: string): boolean => {
    const trimmedValue = value?.toString()?.trim();
    if (trimmedValue?.length === 0) {
        return false;
    } else if (EMAIL_REGEX.test(trimmedValue)) {
        return true;
    } else {
        return false;
    }
};

export const isPhoneNumber = (value: number): boolean => {
    const trimmedValue = value?.toString()?.trim();
    if (trimmedValue?.length === 0) {
        return false;
    } else if (PHONE_REGEX.test(trimmedValue)) {
        return true;
    } else {
        return false;
    }
};

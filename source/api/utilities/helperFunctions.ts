export const trimObject = (obj: any) => {
    Object.keys(obj).forEach((key) => {
        // Allow true, false and off course 0
        if (obj[key] !== true && obj[key] !== false && obj[key] !== 0) {
            if (
                obj[key] == null ||
                obj[key] == undefined ||
                obj[key] == "" ||
                obj[key] == {} ||
                obj[key] == []
            ) {
                delete obj[key];
            }
        }
    });
    for (const key in obj) {
        obj[key] =
            typeof obj[key] == "string" ? obj?.[key]?.trim() : obj?.[key];
    }
    return obj;
};

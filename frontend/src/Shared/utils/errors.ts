import { AxiosError, isAxiosError } from "axios";
import { showToast } from "./alert";

export const flattenErrorMap = (errorMap: object): string[] => {
    let res = [] as any[];
    Object.keys(errorMap).forEach((key) => {
        res = [...res, ...errorMap[key]]
    });
    return res;
}


export const formatAndShowAxiosError = (error: AxiosError | any, form?: any, message?: string) => {

    if (isAxiosError(error) &&
        error?.response?.data &&
        error.response?.data?.message) {
        if (error?.response?.data?.errors) {
            let errors = {};
            Object.keys(error?.response?.data?.errors).map((key) => {
                errors[key] = error?.response?.data?.errors[key][0];
            });
            if (form) {
                form?.setErrors({
                    ...errors,
                });
            }
            const errorsMap = flattenErrorMap(error?.response?.data?.errors);
            for (error in errorsMap) {
                showToast({
                    type: "error",
                    title: errorsMap[error],
                });
            }
        }
        else {
            showToast({
                type: "error",
                title: error.response?.data?.message,
            });
        }
    }
    else {
        showToast({
            type: "error",
            title: error.message || message || "An error occurred",
        });
    }
}
import { toast,  ToastType } from 'react-hot-toast';

interface ToastOptions {
    ariaProps?: Record<string, string>;
    description?: string;
    type?: ToastType;
    title?: string;
    undoable?: boolean;
    actions?: any;

}

export const showToast = (toastOptions: ToastOptions) => {
    toast(JSON.stringify(toastOptions));
}
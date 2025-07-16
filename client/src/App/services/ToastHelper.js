import { toast } from "react-toastify";

export const errorToast = message => toast.error(message, { autoClose: 4000 });
export const successToast = message => toast.success(message);
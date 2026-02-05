// lib/helpers/toast.ts
import { toast } from "sonner";

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
    });
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
    });
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
    });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
    });
  },

  loading: (message: string, description?: string) => {
    return toast.loading(message, {
      description,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },

  dismiss: (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};

// Export individual functions for flexibility
export const successToast = showToast.success;
export const errorToast = showToast.error;
export const infoToast = showToast.info;
export const warningToast = showToast.warning;
export const loadingToast = showToast.loading;
export const promiseToast = showToast.promise;
export const dismissToast = showToast.dismiss;
import toast from "react-hot-toast";

export const showSuccess = (message, options = {}) => {
  return toast.success(message, options);
};

export const showError = (message, options = {}) => {
  return toast.error(message, options);
};

export const showLoading = (message, options = {}) => {
  return toast.loading(message, options);
};

export const showInfo = (message, options = {}) => {
  return toast(message, {
    icon: "ℹ️",
    ...options,
  });
};

export const showApiResponse = (response, isError = false) => {
  const message = response?.message || (isError ? "Request failed" : "Success");
  const details = response?.errors
    ? ` - ${JSON.stringify(response.errors)}`
    : "";

  if (isError) {
    showError(message + details);
  } else {
    showSuccess(message);
  }
};

export const dismiss = (toastId) => {
  toast.dismiss(toastId);
};

export const dismissAll = () => {
  toast.dismiss();
};

import { toaster } from "../Components/ui/toaster";

const useToastHook = () => {
  interface ToastType {
    description: string;
    type: string;
  }

  const showToast = (toastData: ToastType) => {
    toaster.create({
      description: toastData.description,
      type: toastData.type,
    });
  };

  return {
    showToast,
  };
};

export default useToastHook;

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === "success" ? "bg-success" : "bg-error";

  return (
    <div 
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-md shadow-lg flex items-center`}
    >
      <span className="material-icons mr-2">{type === "success" ? "check_circle" : "error"}</span>
      <span>{message}</span>
    </div>
  );
}

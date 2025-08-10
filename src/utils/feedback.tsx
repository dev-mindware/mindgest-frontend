import { Toaster, ToasterProps } from "sonner"

type ToastProps = ToasterProps;

export function CustomToaster({ ...props }: ToastProps) {
  return (
    <Toaster
      position={"top-right"}
      toastOptions={{
        style: {
          background: "#fff",
          color: "#1f2937",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "12px 16px",
        },
        className: "shadow-lg",
      }}
      {...props}
    />
  )
}

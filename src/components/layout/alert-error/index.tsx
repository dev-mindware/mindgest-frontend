
export function AlertError({ id , errorMessage}: { id?: string , errorMessage?: string}) {
  return (
    <div
      className="flex items-center gap-1 mt-2"
      id={`${id}-error`}
      role="alert"
    >
      <span className="text-red-500 text-xs">{errorMessage}</span>
    </div>
  );
}

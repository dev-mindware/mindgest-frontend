export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-dvh w-full overflow-hidden">
      <>{children}</>
    </main>
  );
}

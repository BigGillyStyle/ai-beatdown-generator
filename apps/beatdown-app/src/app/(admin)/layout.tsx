export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="border-b px-6 py-3">
        <span className="font-semibold">Admin</span>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}

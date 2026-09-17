import { Outlet } from "react-router-dom";

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* todo: navbar */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

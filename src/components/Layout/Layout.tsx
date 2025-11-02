import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto w-full max-w-7xl px-6 py-4">
          <h1 className="text-xl font-semibold text-slate-900">
            Blueprint Graph
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
};

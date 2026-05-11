import { SessionProvider } from "next-auth/react";

import { SidebarWrapper } from "@/components/layout/sidebar-wrapper";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <SidebarWrapper />
        <div className="flex-1 flex flex-col min-w-0">
          <MobileNav />
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}

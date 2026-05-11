"use client";

import { signOut } from "next-auth/react";

import { Sidebar } from "./sidebar";

export function SidebarWrapper() {
  return <Sidebar onSignOut={() => signOut({ callbackUrl: "/login" })} />;
}

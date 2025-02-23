"use client";

import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Bell, LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import ThemeToggle from "./theme-toggle";
// import { useHeader } from "@/hooks/use-header";

const Header = () => {
  const router = useRouter();
  const {toast} = useToast();
//   const { title } = useHeader();

const user = JSON.parse(localStorage.getItem("user") || '{}');

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({title : "You have been logged out"})
    router.push("/signin");
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b pr-4 justify-between">
      <div className="flex items-center gap-2 px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* {title} */}
        Dashboard
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <Button onClick={handleLogout}>
            Sign Out <LogOut size={24} />
          </Button>
        ) : (
          <Button
            onClick={() => {
              router.push("/signin");
            }}
          >
            Sign In <LogIn size={24} />
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
};
export default Header;
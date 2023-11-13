"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	signOut,
} from "@/lib/firebase/auth.js";

import { useAuth } from "@/app/context/AuthProvider";

export function SideNavBar(className: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const currentUser = useAuth();
  
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Tablets Map</h2>
          <div className="space-y-1">
            <Link href="/tablets/map/a">
              <Button variant={`${pathname === "/tablets/map/a" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                Block A
              </Button>
            </Link>
            <Link href="/tablets/map/b">
              <Button variant={`${pathname === "/tablets/map/b" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
                Block B
              </Button>
            </Link>
            <Link href="/tablets/map/c">
              <Button variant={`${pathname === "/tablets/map/c" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                  <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                  <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
                </svg>
                Block C
              </Button>
            </Link>
            <Link href="/tablets/map/d">
              <Button variant={`${pathname === "/tablets/map/d" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                  <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                  <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
                </svg>
                Block D
              </Button>
            </Link>
            <Link href="/tablets/map/e">
              <Button variant={`${pathname === "/tablets/map/e" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                  <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                  <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
                </svg>
                Block E
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
          <div className="space-y-1">
            <Link href="/tablets/list">
              <Button variant={`${pathname === "/tablets/list" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <path d="M21 15V6" />
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  <path d="M12 12H3" />
                  <path d="M16 6H3" />
                  <path d="M12 18H3" />
                </svg>
                Tablets List
              </Button>
            </Link>
            <Link href="/invoicemanagement">
              <Button variant={`${pathname === "/invoicemanagement" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <circle cx="8" cy="18" r="4" />
                  <path d="M12 18V2l7 4" />
                </svg>
                Manage Invoices
              </Button>
            </Link>
            <Link href="/accountmanagement">
              <Button variant={`${pathname === "accountmanagement" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Manage Accounts
              </Button>
            </Link>
          </div>
        </div>
        <div className="py-2">
          <h2 className="relative px-7 text-lg font-semibold tracking-tight hidd">User</h2>
          <div className="space-y-1 p-2">
            <div className={currentUser?.email ? 'block' : 'hidden'} onClick={signOut}>
              <Button variant="ghost" className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {currentUser?.email ? currentUser?.email : 'Error'}
              </Button>
            </div>
            <Link href="/login" className={currentUser?.email ? 'hidden' : 'block'}>
              <Button variant={`${pathname === "/login" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

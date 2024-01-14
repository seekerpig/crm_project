"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/firebase/auth.js";

import { useAuth } from "@/app/context/AuthProvider";
import { getUserRole } from "@/lib/firebase/firebase";
import { useEffect, useState } from "react";

export function SideNavBar(className: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();
  const currentUser = useAuth();

  return currentUser ? (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <Link href="/">
          <div className="pl-5 flex items-center hover:opacity-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/temple-icon.jpeg" alt="temple-icon" className="w-[40px] h-[50px]" />
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">真空教本元山道堂</h2>
          </div>
        </Link>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Tablets Map</h2>
          <div className="space-y-1">
            <Link href="/tablets/map/a">
              <Button variant={`${pathname === "/tablets/map/a" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg className="mr-2 h-6 w-6" fill="#000000" width="800px" height="800px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                  <path d="M136,84v92a4,4,0,0,1-8,0V91.47217l-17.78223,11.84961a3.99977,3.99977,0,1,1-4.43554-6.65723l24-15.99316A3.99993,3.99993,0,0,1,136,84Zm84-36V208a12.01343,12.01343,0,0,1-12,12H48a12.01343,12.01343,0,0,1-12-12V48A12.01343,12.01343,0,0,1,48,36H208A12.01343,12.01343,0,0,1,220,48Zm-8,0a4.00427,4.00427,0,0,0-4-4H48a4.00427,4.00427,0,0,0-4,4V208a4.00427,4.00427,0,0,0,4,4H208a4.00427,4.00427,0,0,0,4-4Z" />
                </svg>
                Block A
              </Button>
            </Link>
            <Link href="/tablets/map/b">
              <Button variant={`${pathname === "/tablets/map/b" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg className="mr-2 h-6 w-6" fill="#000000" width="800px" height="800px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                  <path d="M208,36H48A12.01343,12.01343,0,0,0,36,48V208a12.01343,12.01343,0,0,0,12,12H208a12.01343,12.01343,0,0,0,12-12V48A12.01343,12.01343,0,0,0,208,36Zm4,172a4.00427,4.00427,0,0,1-4,4H48a4.00427,4.00427,0,0,1-4-4V48a4.00427,4.00427,0,0,1,4-4H208a4.00427,4.00427,0,0,1,4,4Zm-60.89746-88.18262L112.001,171.99414H152a4,4,0,0,1,0,8H104.2207c-.07324.00391-.14746.00635-.22168.00635a4.00218,4.00218,0,0,1-3.13281-6.48877l43.77344-58.41016a20.0044,20.0044,0,1,0-35.07031-18.88525,3.99957,3.99957,0,1,1-7.36719-3.11621,28.00379,28.00379,0,1,1,49.01367,26.55761C151.17969,119.71191,151.1416,119.76514,151.10254,119.81738Z" />
                </svg>
                Block B
              </Button>
            </Link>
            <Link href="/tablets/map/d">
              <Button variant={`${pathname === "/tablets/map/d" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg className="mr-2 h-6 w-6" fill="#000000" width="800px" height="800px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                  <path d="M146.62793,129.377a31.99676,31.99676,0,1,1-45.249,45.25147,3.99992,3.99992,0,1,1,5.65625-5.65723,23.99709,23.99709,0,1,0,16.96875-40.9668,3.99972,3.99972,0,0,1-3.27735-6.293L144.31348,88H104a4,4,0,0,1,0-8h47.99414a3.99973,3.99973,0,0,1,3.27734,6.293l-24.14062,34.50342A31.78143,31.78143,0,0,1,146.62793,129.377ZM220,48V208a12.01343,12.01343,0,0,1-12,12H48a12.01343,12.01343,0,0,1-12-12V48A12.01343,12.01343,0,0,1,48,36H208A12.01343,12.01343,0,0,1,220,48Zm-8,0a4.00427,4.00427,0,0,0-4-4H48a4.00427,4.00427,0,0,0-4,4V208a4.00427,4.00427,0,0,0,4,4H208a4.00427,4.00427,0,0,0,4-4Z" />
                </svg>
                Block D
              </Button>
            </Link>
            <Link href="/tablets/map/e">
              <Button variant={`${pathname === "/tablets/map/e" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg className="mr-2 h-6 w-6" fill="#000000" width="800px" height="800px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                  <path d="M208,36H48A12.01343,12.01343,0,0,0,36,48V208a12.01343,12.01343,0,0,0,12,12H208a12.01343,12.01343,0,0,0,12-12V48A12.01343,12.01343,0,0,0,208,36Zm4,172a4.00427,4.00427,0,0,1-4,4H48a4.00427,4.00427,0,0,1-4-4V48a4.00427,4.00427,0,0,1,4-4H208a4.00427,4.00427,0,0,1,4,4Zm-60.89746-88.18262L112.001,171.99414H152a4,4,0,0,1,0,8H104.2207c-.07324.00391-.14746.00635-.22168.00635a4.00218,4.00218,0,0,1-3.13281-6.48877l43.77344-58.41016a20.0044,20.0044,0,1,0-35.07031-18.88525,3.99957,3.99957,0,1,1-7.36719-3.11621,28.00379,28.00379,0,1,1,49.01367,26.55761C151.17969,119.71191,151.1416,119.76514,151.10254,119.81738Z" />
                </svg>
                Block E
              </Button>
            </Link>
            <Link href="/tablets/map/f">
              <Button variant={`${pathname === "/tablets/map/f" ? "secondary" : "ghost"}`} className="w-full justify-start">
                <svg className="mr-2 h-6 w-6" fill="#000000" width="800px" height="800px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                  <path d="M146.62793,129.377a31.99676,31.99676,0,1,1-45.249,45.25147,3.99992,3.99992,0,1,1,5.65625-5.65723,23.99709,23.99709,0,1,0,16.96875-40.9668,3.99972,3.99972,0,0,1-3.27735-6.293L144.31348,88H104a4,4,0,0,1,0-8h47.99414a3.99973,3.99973,0,0,1,3.27734,6.293l-24.14062,34.50342A31.78143,31.78143,0,0,1,146.62793,129.377ZM220,48V208a12.01343,12.01343,0,0,1-12,12H48a12.01343,12.01343,0,0,1-12-12V48A12.01343,12.01343,0,0,1,48,36H208A12.01343,12.01343,0,0,1,220,48Zm-8,0a4.00427,4.00427,0,0,0-4-4H48a4.00427,4.00427,0,0,0-4,4V208a4.00427,4.00427,0,0,0,4,4H208a4.00427,4.00427,0,0,0,4-4Z" />
                </svg>
                Block F
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
          <div className="space-y-1">
            <Link href="/tablets/list">
              <Button variant={`${pathname === "/tablets/list" ? "secondary" : "ghost"}`} className="w-full justify-start">
              <svg className="mr-2 h-4 w-4" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2H12.5C12.7761 2 13 2.22386 13 2.5V5H8V2ZM7 5V2H2.5C2.22386 2 2 2.22386 2 2.5V5H7ZM2 6V9H7V6H2ZM8 6H13V9H8V6ZM8 10H13V12.5C13 12.7761 12.7761 13 12.5 13H8V10ZM2 12.5V10H7V13H2.5C2.22386 13 2 12.7761 2 12.5ZM1 2.5C1 1.67157 1.67157 1 2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                Tablets List
              </Button>
            </Link>
            <Link href="/invoicemanagement">
              <Button variant={`${pathname === "/invoicemanagement" ? "secondary" : "ghost"}`} className="w-full justify-start">
              <svg className="mr-2 h-4 w-4"width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
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
            <div className={currentUser?.email ? "block" : "hidden"} onClick={signOut}>
              <Button variant="ghost" className="w-full justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {currentUser?.email ? currentUser?.email : "Error"}
              </Button>
            </div>
            <Link href="/login" className={currentUser?.email ? "hidden" : "block"}>
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
  ) : (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <Link href="/">
          <div className="pl-5 flex items-center hover:opacity-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/temple-icon.jpeg" alt="temple-icon" className="w-[40px] h-[50px]" />
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">真空教本元山道堂</h2>
          </div>
        </Link>
        <Link href="/login" className={currentUser?.email ? "hidden" : "block"}>
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
  );
}

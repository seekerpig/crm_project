import { Metadata } from "next";
import Link from "next/link";

import { UserAuthForm } from "@/components/user-auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "",
};

export default function LoginPage() {
  return (
    <>
      <div className="container h-full">
        <div className="lg:p-8 lg:m-20 h-full ">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="w-full flex justify-center">
              {/*eslint-disable-next-line @next/next/no-img-element*/}
              <img src="/authLogin.png" alt="login" className="h-40 w-40" />
            </div>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Account Login</h1>
              <p className="text-sm text-muted-foreground">Enter your email and password below to login</p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

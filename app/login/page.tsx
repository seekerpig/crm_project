import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import authLogo from "../../public/authLogin.png";

import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "",
};

export default function LoginPage() {
  return (
    <>
      <div className="container h-full">
        <div className="lg:p-8 h-full m-20">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="w-full flex justify-center">
              <img src="/authLogin.png" alt="login" className="h-40 w-40" />
            </div>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
              <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
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

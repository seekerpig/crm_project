"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthProvider";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [formMessage, setFormMessage] = React.useState("");
  const router = useRouter();

  const currentUser = useAuth();
  React.useEffect(() => {
    if (currentUser) {
      setFormMessage("User already logged in. Redirecting...");
      setTimeout(() => {
        router.push("/tablets/map/a");
      }, 3000);
    }
  

  }, [currentUser, router])
  
  

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    // Do something with the login.
    const formData = new FormData(event.currentTarget);
    const username = formData.get("email") as string;
    const password = formData.get("password") as string;

    signIn(username, password)
      .then(() => {
        setIsLoading(false);
        setFormMessage("Login is successful. Redirecting...");
        setTimeout(() => {
          router.push("/tablets/map/a");
        }, 3000);
      })
      .catch((error) => {
        console.log("Error during sign-in", error);
        setFormMessage("Invalid Username or Password");
        setIsLoading(false);
      });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="name@example.com" type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" disabled={isLoading} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" placeholder="*********" type="password" autoCapitalize="none" autoCorrect="off" disabled={isLoading} />
          </div>
          <Button disabled={isLoading} type="submit">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </div>
      </form>
      <Alert variant="default" className={formMessage ? "block" : "hidden"}>
        <AlertDescription>{formMessage}</AlertDescription>
      </Alert>
    </div>
  );
}

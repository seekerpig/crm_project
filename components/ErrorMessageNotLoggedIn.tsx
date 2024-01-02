"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthProvider";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ErrorMessageNotLoggedIn() {
  const currentUser = useAuth();

  return (
    <>
      {!currentUser && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>This is the guest page</AlertTitle>
          {/*eslint-disable-next-line react/no-unescaped-entities*/}
          <AlertDescription>You're currently not logged in. Do log in if you're an administrator</AlertDescription>
        </Alert>
      )}
    </>
  );
}

export default ErrorMessageNotLoggedIn;

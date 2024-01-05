"use client";
import ProtectedPage from "@/components/ProtectedPage";
import { Button } from "@/components/ui/button";
import CheckEditPermission from "@/components/CheckEditPermission";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/context/AuthProvider";
import { db, secondaryAuth } from "@/lib/firebase/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function SignUp() {
  const { toast } = useToast();
  const currentUser = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function createAccount(): Promise<void> {
    const editPermission = await CheckEditPermission(currentUser);
    if (editPermission) {
      createUserWithEmailAndPassword(secondaryAuth, email, password)
        .then((userCredential) => {
          const firebaseUser = userCredential.user;
          console.log("User created successfully, ", firebaseUser.uid, firebaseUser.email);
          signOut(secondaryAuth);

          const userDocRef = doc(db, "users", firebaseUser.uid);
          setDoc(userDocRef, { email: email, permission: "read" });
          toast({
            title: "User created successfully",
            description: "User with email: " + email + " was created successfully",
          });
          setTimeout(() => {window.location.href = "/accountmanagement";}, 2000);
        })
        .catch((error) => {
          toast({
            title: "User creation error",
            description: "Error: " + error,
          });
          console.error("Error creating user:", error.message);
        });
    } else {
      toast({
        title: "No Edit Permission",
        description: "Edit permission for current logged in account is required to create new users",
      });
      console.log("No Permission for Create Acc");
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <ProtectedPage />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Create an account</h1>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </label>
              <input type="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required={true} />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input type="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} />
            </div>
            <Button onClick={async () => await createAccount()}>Create an account</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;

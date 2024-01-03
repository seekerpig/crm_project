import React from "react";
import { DataTable } from "./components/data-table";
import { db } from "@/lib/firebase/firebase";
import { columns } from "./components/columns";

import { collection, query, getDocs } from "firebase/firestore";
import { User } from "../data/dataTypes";
import { Button } from "@/components/ui/button";
import ProtectedPage from "@/components/ProtectedPage";
import Link from 'next/link'

async function getUsers() {
  const q = query(collection(db, "users"));

  const querySnapshot = await getDocs(q);

  var users: User[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const newUser: User = {
      User_ID: doc.id,
      Email: data.email,
      Permission: data.permission,
    };
    users.push(newUser);
  });

  return users;
}

async function AccountManagement() {
  const users = await getUsers();
  return (
    <div>
      <ProtectedPage />
      <Link href="/signup"><Button className="mr-5">Create New User</Button></Link>
      <a href="https://console.firebase.google.com/u/0/project/temple-de382/authentication/users" target="_blank">
        <Button className="mb-5">Link to Delete User in Authentication</Button>
      </a>
      
      <DataTable data={users} columns={columns} />
    </div>
  );
}

export default AccountManagement;

"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { User } from "@/app/data/dataTypes";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { useToast } from "@/components/ui/use-toast";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const user: User = row.original as User;
  const { toast } = useToast();

  function setPermission(permission: string) {
    const collectionRef = collection(db, "users");
    const documentID = user.User_ID;
    const docRef = doc(collectionRef, documentID);

    try {
      updateDoc(docRef, {
        ["permission"]: permission,
      }).then(() => {
        toast({
          title: "Permission Updated",
          description: "Permission Updated to, " + permission,
        });

        setTimeout(() => window.location.reload(), 500);
      });
    } catch (error) {
      toast({
        title: "Error Updating Permission",
        description: "Error " + error,
      });
    }
  }

  function deleteUser(): void {
    try {
      const collectionRef = collection(db, "users");
      const documentID = user.User_ID;
      const docRef = doc(collectionRef, documentID);

      deleteDoc(docRef).then(() => {
        toast({
          title: "Successful",
          description: "User deleted successfully from database, you will still need to remove the user in the Authentication in firebase",
        });
        setTimeout(() => window.location.reload(), 500);
      });
    } catch (error) {
      toast({
        title: "Unsuccessful",
        description: "Error deleting user: " + error,
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => setPermission("edit")}>Set Edit Permission</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPermission("read")}>Set Read Only Permission</DropdownMenuItem>
        <DropdownMenuItem onClick={() => deleteUser()}>Delete User</DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

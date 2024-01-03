"use client";

import { getUserRole } from "@/lib/firebase/firebase";

export async function CheckEditPermission(currentUser: any) {
  if (currentUser) {
    const userRole = await getUserRole(currentUser?.uid);

    if (userRole && userRole == "edit") {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

export default CheckEditPermission;

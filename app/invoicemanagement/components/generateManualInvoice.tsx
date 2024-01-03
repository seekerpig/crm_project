"use client";

import React, { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Invoice, TabletApplication } from "@/app/data/dataTypes";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/context/AuthProvider";
import CheckEditPermission from "@/components/CheckEditPermission";

import { db } from "@/lib/firebase/firebase";
import { collection, query, where, getDocs, doc, getDoc, writeBatch, addDoc, setDoc, updateDoc } from "firebase/firestore";

// Must be called after the tablet application itself is created.
export async function CreateInvoiceAsPaid(tablet_number: string, amt: number, app_type: string) {
  // First need to find the tabletNo with the Current status and see if it exists.
  const queryTabletApplication = query(collection(db, "tabletapplications"), where("Tablet_Number", "==", tablet_number.toUpperCase()), where("Status", "==", "Current"));
  const querySnapshotTabletApplication = await getDocs(queryTabletApplication);
  if (amt <= 0) {
    console.log("Amount cannot be 0 or less");
  } else if (querySnapshotTabletApplication.empty) {
    // Cannot find any tablet to add the invoice
    console.log("Unable to find any current tablet application associated with the tablet number: ", tablet_number);
  } else {
    try {
      const tabletApp = querySnapshotTabletApplication.docs[0].data() as TabletApplication;
      const docRef = doc(db, "invoicemetadata", new Date().getFullYear().toString());
      const docSnap = await getDoc(docRef);

      let invoiceDescription: "Purchase of Tablet Leasing (Normal)" | "Purchase of Tablet (Special)" | "Installment Downpayment" | "Custom Payment" = "Custom Payment";

      switch (app_type) {
        case "N":
          invoiceDescription = "Purchase of Tablet Leasing (Normal)";
          break;
        case "S":
          invoiceDescription = "Purchase of Tablet (Special)";
          break;
        case "IPT":
          invoiceDescription = "Installment Downpayment";
          break;
        // Add additional cases if needed
        default:
          // Handle the case where app_type doesn't match any of the expected values
          break;
      }

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        let currentLatestInvoiceNumber: number = Number(docSnap.data().latestInvoiceNo);
        currentLatestInvoiceNumber++;

        // Check whether if the app data is of IPT type
        const newInvoice: Invoice = {
          InvoiceNo: new Date().getFullYear().toString().substring(2) + currentLatestInvoiceNumber.toString().padStart(3, "0"),
          ApplicationID: tabletApp.ApplicationID,
          Dated: new Date().toISOString(),
          Terms: "",
          Tablet_Number: tabletApp.Tablet_Number,
          Payee_Name: tabletApp.Applicant_Name_English,
          Payee_Address: tabletApp.Applicant_Address,
          Description: invoiceDescription,
          Fiscal_Year: new Date().getFullYear(),
          Receipt_No: "",
          Amount: amt,
          Year_Positioned: new Date().getFullYear(),
          IsPaid: true,
        };

        const invoiceDocRef = doc(db, "invoices", newInvoice.InvoiceNo.toString());
        setDoc(invoiceDocRef, newInvoice);

        updateDoc(docRef, { latestInvoiceNo: currentLatestInvoiceNumber });

      } else {
        console.log("Metadata for invoice numbering not found for the year, must create new one.");
        let currentLatestInvoiceNumber: number = 1;

        const newInvoice: Invoice = {
          InvoiceNo: new Date().getFullYear().toString().substring(2) + currentLatestInvoiceNumber.toString().padStart(3, "0"),
          ApplicationID: tabletApp.ApplicationID,
          Dated: new Date().toISOString(),
          Terms: "",
          Tablet_Number: tabletApp.Tablet_Number,
          Payee_Name: tabletApp.Applicant_Name_English,
          Payee_Address: tabletApp.Applicant_Address,
          Description: invoiceDescription,
          Fiscal_Year: new Date().getFullYear(),
          Receipt_No: "",
          Amount: amt,
          Year_Positioned: new Date().getFullYear(),
          IsPaid: true,
        };

        const invoiceDocRef = doc(db, "invoices", newInvoice.InvoiceNo.toString());
        setDoc(invoiceDocRef, newInvoice);

        setDoc(docRef, { latestInvoiceNo: currentLatestInvoiceNumber });
      }
    } catch (error) {
      console.log("Error creating invoice: ", error);
    }
  }
}
function GenerateManualInvoiceModal() {
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(0);
  const [tabletNo, setTabletNo] = useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentUser = useAuth();

  async function finaliseGenerateInvoice() {
    // First need to find the tabletNo with the Current status and see if it exists.
    const queryTabletApplication = query(collection(db, "tabletapplications"), where("Tablet_Number", "==", tabletNo?.toUpperCase()), where("Status", "==", "Current"));
    const querySnapshotTabletApplication = await getDocs(queryTabletApplication);
    if (amount <= 0) {
      console.log("Amount cannot be 0 or less");
      toast({
        title: "Amount Error",
        description: "Amount cannot be 0 or less",
      });
    } else if (querySnapshotTabletApplication.empty) {
      // Cannot find any tablet to add the invoice
      console.log("Unable to find any current tablet application associated with the tablet number: ", tabletNo);
      toast({
        title: "Unable to find",
        description: "Unable to find any current tablet application associated with the tablet number: " + tabletNo,
      });
    } else {
      try {
        const tabletApp = querySnapshotTabletApplication.docs[0].data() as TabletApplication;
        const docRef = doc(db, "invoicemetadata", new Date().getFullYear().toString());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          let currentLatestInvoiceNumber: number = Number(docSnap.data().latestInvoiceNo);
          currentLatestInvoiceNumber++;

          // Check whether if the app data is of IPT type
          const newInvoice: Invoice = {
            InvoiceNo: new Date().getFullYear().toString().substring(2) + currentLatestInvoiceNumber.toString().padStart(3, "0"),
            ApplicationID: tabletApp.ApplicationID,
            Dated: new Date().toISOString(),
            Terms: "30 Days",
            Tablet_Number: tabletApp.Tablet_Number,
            Payee_Name: tabletApp.Applicant_Name_English,
            Payee_Address: tabletApp.Applicant_Address,
            Description: "Custom Payment",
            Fiscal_Year: new Date().getFullYear(),
            Receipt_No: "",
            Amount: amount,
            Year_Positioned: new Date().getFullYear(),
            IsPaid: false,
          };

          const invoiceDocRef = doc(db, "invoices", newInvoice.InvoiceNo.toString());
          setDoc(invoiceDocRef, newInvoice);

          updateDoc(docRef, { latestInvoiceNo: currentLatestInvoiceNumber });

          toast({
            title: "Successful",
            description: "Invoice created successfully",
          });
          setTimeout(() => window.location.reload(), 500);
        } else {
          console.log("Metadata for invoice numbering not found for the year, must create new one.");
          let currentLatestInvoiceNumber: number = 1;

          const newInvoice: Invoice = {
            InvoiceNo: new Date().getFullYear().toString().substring(2) + currentLatestInvoiceNumber.toString().padStart(3, "0"),
            ApplicationID: tabletApp.ApplicationID,
            Dated: new Date().toISOString(),
            Terms: "30 Days",
            Tablet_Number: tabletApp.Tablet_Number,
            Payee_Name: tabletApp.Applicant_Name_English,
            Payee_Address: tabletApp.Applicant_Address,
            Description: "Custom Payment",
            Fiscal_Year: new Date().getFullYear(),
            Receipt_No: "",
            Amount: amount,
            Year_Positioned: new Date().getFullYear(),
            IsPaid: false,
          };

          const invoiceDocRef = doc(db, "invoices", newInvoice.InvoiceNo.toString());
          setDoc(invoiceDocRef, newInvoice);

          setDoc(docRef, { latestInvoiceNo: currentLatestInvoiceNumber });

          toast({
            title: "Successful",
            description: "Invoice created successfully",
          });
          setTimeout(() => window.location.reload(), 500);
        }
      } catch (error) {
        toast({
          title: "Unsuccessful",
          description: "Error creating custom invoice" + error,
        });
        console.log("Error creating invoice: ", error);
      }
    }
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="ml-3" variant="outline">
          Generate A Manual Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full flex max-h-[80vh]">
        <DialogHeader className="w-full">
          <DialogTitle>Generate Custom Invoice</DialogTitle>
          <div className="w-full flex flex-col">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="tablet_no" className="mt-3 mb-1">
                Tablet No:
              </Label>
              <Input
                id="tablet_no"
                placeholder="e.g. A0101"
                value={tabletNo}
                onChange={(e) => {
                  setTabletNo(e.target.value);
                }}
              />
              <Label htmlFor="custom_amt" className="mt-3 mb-1">
                Amount ($):
              </Label>
              <Input
                id="custom_amt"
                type="number"
                step="0.01"
                placeholder="e.g. $100"
                value={amount.toString()}
                onChange={(e) => {
                  setAmount(parseFloat(e.target.value));
                }}
              />
            </div>
          </div>
          <div className="w-full mt-3 flex flex-col items-center">
            <Button onClick={async () => {
                  const hasEditPermission = await CheckEditPermission(currentUser);

                  if (hasEditPermission) {
                    finaliseGenerateInvoice();
                  } else {
                    toast({
                      title: "No Edit Permission",
                      description: "Your current account has no edit permission",
                    });
                  }
                }} className="w-[180px]">
              Confirm Add Invoices
            </Button>
            <DialogDescription className="mt-3 mb-5">This action cannot be undone. You can delete the invoices manually if you want to revert.</DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateManualInvoiceModal;

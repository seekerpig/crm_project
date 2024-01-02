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


import { db } from "@/lib/firebase/firebase";
import { collection, query, where, getDocs, doc, getDoc, writeBatch, addDoc, setDoc, updateDoc } from "firebase/firestore";

function GenerateMaintenanceInvoiceModal(props: any) {
  const { invoiceData } = props;
  const { toast } = useToast();

  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [price, setSelectedPrice] = useState(30);
  const [showTable, setShowTable] = useState(false);
  const [invoices, setInvoices] = useState([] as Invoice[]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePriceChange = (event: any) => {
    // Parse the input value as a float
    const newPrice = parseFloat(event.target.value);

    // Check if the parsed value is a valid number
    if (!isNaN(newPrice)) {
      setSelectedPrice(newPrice);
    }
  };

  const handleDeleteInvoice = (applicationID: string) => {
    // Remove the invoice from the invoices list
    const updatedInvoices = invoices.filter((invoice) => invoice.ApplicationID !== applicationID);
    setInvoices(updatedInvoices);
  };

  async function getInvoicesForApplicationsNormalType(year: string, price: number) {
    const queryTabletApplications = query(collection(db, "tabletapplications"), where("Application_Type", "==", "N"), where("Status", "==", "Current"));

    const querySnapshotTabletApplications = await getDocs(queryTabletApplications);

    var currInvoices: Invoice[] = [];

    querySnapshotTabletApplications.forEach((doc) => {
      let tabletApplication = doc.data() as TabletApplication;
      let invoice: Invoice = {
        InvoiceNo: "",
        ApplicationID: tabletApplication.ApplicationID,
        Dated: new Date().toISOString(),
        Terms: "30 Days",
        Tablet_Number: tabletApplication.Tablet_Number,
        Payee_Name: tabletApplication.Applicant_Name_English,
        Payee_Address: tabletApplication.Applicant_Address,
        Description: "Annual Fee for Maintenance of Ancestor Tablet",
        Fiscal_Year: Number(year),
        Receipt_No: "",
        Amount: price,
        Year_Positioned: new Date(tabletApplication.Leasing_Date).getFullYear(),
        IsPaid: false,
      };
      currInvoices.push(invoice);
    });
    console.log("Before filtered invoices:", currInvoices);
    setInvoices(currInvoices);
    setShowTable(true);
  }

  const handleGenerateMaintenanceInvoices = async () => {
    // Check if both year and month are selected
    if (selectedYear !== null && price !== null) {
      await getInvoicesForApplicationsNormalType(selectedYear.toString(), price);
      console.log("Generating invoices for:", selectedYear, " and for price: ", price);
    } else {
      // Handle the case where either year or month is not selected
      console.error("Please select year and input a valid price");
    }
  };
  async function finaliseGenerateInvoice() {
    const docRef = doc(db, "invoicemetadata", selectedYear.toString());
    const docSnap = await getDoc(docRef);

    const batchedWrite = writeBatch(db);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      let currentLatestInvoiceNumber: number = Number(docSnap.data().latestInvoiceNo);
      currentLatestInvoiceNumber++;

      try {
        for (const invoice of invoices) {
          invoice.InvoiceNo = selectedYear.toString().substring(2) + currentLatestInvoiceNumber.toString().padStart(3, "0");
          const invoiceDocRef = doc(db, "invoices", invoice.InvoiceNo.toString());
          setDoc(invoiceDocRef, invoice);
          currentLatestInvoiceNumber++;
        }

        updateDoc(docRef, { latestInvoiceNo: currentLatestInvoiceNumber - 1 });
        await batchedWrite.commit();

        toast({
          title: "Successful",
          description: "Invoices were created successfully",
        });

        console.log("Invoices added to database", invoices);
        setInvoices([]);
        setShowTable(false);
      } catch (error: any) {
        console.error("Error adding invoices:", error.message);
      }
    } else {
      console.log("No such invoice metadata with the selected year, must create new year!");

      let currentLatestInvoiceNumber: number = 1;
      try {
        for (const invoice of invoices) {
          invoice.InvoiceNo = selectedYear.toString().substring(2) + currentLatestInvoiceNumber.toString().padStart(3, "0");
          const invoiceDocRef = doc(db, "invoices", invoice.InvoiceNo.toString());
          setDoc(invoiceDocRef, invoice);
          currentLatestInvoiceNumber++;
        }

        setDoc(docRef, { latestInvoiceNo: currentLatestInvoiceNumber - 1 });
        await batchedWrite.commit();

        console.log("Invoices added to database", invoices);
        setInvoices([]);
        setShowTable(false);
      } catch (error: any) {
        console.error("Error adding invoices:", error.message);
      }
    }
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setShowTable(false)}>Generate Yearly Maintenance Invoice</Button>
      </DialogTrigger>
      <DialogContent className="w-full flex lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl overflow-y-scroll max-h-[80vh]">
        <DialogHeader className={`${showTable == false ? "w-full" : "hidden"}  `}>
          <DialogTitle>Generate Maintenance Invoices for Year</DialogTitle>
          <div className="w-full flex flex-col">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="year" className="mt-3 mb-1">
                Year:
              </Label>
              <Select
                defaultValue={selectedYear.toString()}
                onValueChange={(value: string) => {
                  setSelectedYear(Number(value));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Year</SelectLabel>
                    {Array.from({ length: 10 }, (_, index) => currentYear + 2 - index).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5 mt-3">
              <Label htmlFor="number">Price (S$)</Label>
              <Input type="number" step="0.01" id="number" placeholder="30" value={price} onChange={handlePriceChange} />
            </div>
            <div className="w-full mt-4">
              <Button className="w-[180px]" onClick={handleGenerateMaintenanceInvoices}>
                Generate Invoices
              </Button>
            </div>
          </div>
        </DialogHeader>
        <DialogHeader className={`${showTable == false ? "hidden" : "w-full"}  `}>
          <DialogTitle>Please confirm the invoices to be generated:</DialogTitle>
          <p>There is a total of {invoices.length} invoices to be generated</p>
          <div className="w-full">
            <Table>
              <TableCaption>A list of your invoices to be generated.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Fiscal Year</TableHead>
                  <TableHead>Dated</TableHead>
                  <TableHead>Terms</TableHead>
                  <TableHead>Tablet Number</TableHead>
                  <TableHead>Payee Name</TableHead>
                  <TableHead>Payee Address</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount (S$)</TableHead>
                  <TableHead>Year Positioned</TableHead>
                  <TableHead>Is Paid</TableHead>
                  <TableHead>Receipt No</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.ApplicationID.toString()}>
                    <TableCell>{invoice.Fiscal_Year.toString()}</TableCell>
                    <TableCell>{new Date(invoice.Dated.toString()).toDateString()}</TableCell>
                    <TableCell>{invoice.Terms}</TableCell>
                    <TableCell>{invoice.Tablet_Number}</TableCell>
                    <TableCell>{invoice.Payee_Name}</TableCell>
                    <TableCell>{invoice.Payee_Address}</TableCell>
                    <TableCell>{invoice.Description}</TableCell>
                    <TableCell className="text-right">${invoice.Amount.toString()}</TableCell>
                    <TableCell>{invoice.Year_Positioned.toString()}</TableCell>
                    <TableCell>{invoice.IsPaid ? "True" : "False"}</TableCell>
                    <TableCell>{invoice.Receipt_No}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleDeleteInvoice(invoice.ApplicationID.toString())}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={12}>Total Amount:</TableCell>
                  <TableCell className="text-right">${invoices.reduce((total, invoice) => total + Number(invoice.Amount), 0).toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className="w-full mt-3 flex flex-col items-center">
              <Button onClick={() => finaliseGenerateInvoice()} className="w-[180px]">
                Confirm Add Invoices
              </Button>
              <DialogDescription className="mt-3 mb-5">This action cannot be undone. You can delete the invoices manually if you want to revert.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateMaintenanceInvoiceModal;

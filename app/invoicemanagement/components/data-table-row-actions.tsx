"use client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { Invoice, TabletApplication } from "../../data/dataTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

import { db } from "@/lib/firebase/firebase";
import { updateDoc, doc, collection, deleteDoc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CheckEditPermission } from "@/components/CheckEditPermission";
import { useAuth } from "@/app/context/AuthProvider";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const invoice: Invoice = row.original as Invoice;
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [viewInvoice, setViewInvoice] = React.useState(false);
  const [alertDialog, setAlertDialog] = React.useState(false);
  const [receiptNo, setReceiptNo] = React.useState(invoice.Receipt_No);
  const downloadablePdfRef = useRef(null);
  const { toast } = useToast();
  const currentUser = useAuth();
  const [descriptionDetails, setDescriptionDetails] = React.useState<string[]>([]);
  const [paymentTotals, setPaymentTotals] = React.useState<number[]>([]);
  const [currentInvoiceTabletApp, setCurrentInvoiceTabletApp] = React.useState<TabletApplication>();

  async function updateDescriptionAndPaymentDetails() {
    const tabletAppID = invoice.ApplicationID.toString();
    const tabletRef = doc(db, "tabletapplications", tabletAppID);

    const tablet = (await getDoc(tabletRef)).data() as TabletApplication;
    if (invoice.Description == "Purchase of Tablet Leasing (Normal)") {
      let desc = [];
      let costs = [];
      desc.push("Purchase of Tablet Leasing Cost");
      costs.push(tablet.PurchaseOfPlacementCost.valueOf());
      costs.push(tablet.TabletCost.valueOf());
      desc.push("Cost of Tablet");
      if (tablet.SelectionOfPlacementCost && tablet.SelectionOfPlacementCost.valueOf() > 0) {
        desc.push("Cost of Selection");
        costs.push(tablet.SelectionOfPlacementCost.valueOf());
      }
      if (tablet.JiLing && tablet.JiLing.valueOf() > 0) {
        desc.push("Cost of Ji Ling");
        costs.push(tablet.JiLing.valueOf());
      }
      if (tablet.OtherCost && tablet.OtherCost.valueOf() > 0) {
        desc.push("Others Cost");
        costs.push(tablet.OtherCost.valueOf());
      }
      setDescriptionDetails(desc);
      setPaymentTotals(costs);
    } else if (invoice.Description == "Purchase of Tablet (Special)") {
      let desc = [];
      let costs = [];
      desc.push("Purchase of Tablet Cost");
      costs.push(tablet.PurchaseOfPlacementCost.valueOf());
      costs.push(tablet.TabletCost.valueOf());
      desc.push("Cost of Tablet");
      if (tablet.SelectionOfPlacementCost && tablet.SelectionOfPlacementCost.valueOf() > 0) {
        desc.push("Cost of Selection");
        costs.push(tablet.SelectionOfPlacementCost.valueOf());
      }
      if (tablet.JiLing && tablet.JiLing.valueOf() > 0) {
        desc.push("Cost of Ji Ling");
        costs.push(tablet.JiLing.valueOf());
      }
      if (tablet.OtherCost && tablet.OtherCost.valueOf() > 0) {
        desc.push("Others Cost");
        costs.push(tablet.OtherCost.valueOf());
      }
      setDescriptionDetails(desc);
      setPaymentTotals(costs);
    } else if (invoice.Description == "Installment Downpayment") {
      let desc = [];
      let costs = [];
      desc.push("Purchase of Tablet Cost ($" + tablet.PurchaseOfPlacementCost.valueOf() + ")");
      desc.push("Cost of Tablet ($" + tablet.TabletCost.valueOf() + ")");
      costs.push(0);
      costs.push(0);
      if (tablet.SelectionOfPlacementCost && tablet.SelectionOfPlacementCost.valueOf() > 0) {
        desc.push("Cost of Selection ($" + tablet.SelectionOfPlacementCost.valueOf() + ")");
        costs.push(0);
      }
      if (tablet.JiLing && tablet.JiLing.valueOf() > 0) {
        desc.push("Cost of Ji Ling ($" + tablet.JiLing.valueOf() + ")");
        costs.push(0);
      }
      if (tablet.OtherCost && tablet.OtherCost.valueOf() > 0) {
        desc.push("Other Costs ($" + tablet.OtherCost.valueOf() + ")");
        costs.push(0);
      }
      desc.push("Total Cost of Purchase ($" + tablet.TotalCostOfPurchase.valueOf() + ")");
      costs.push(0);
      desc.push("Installment Downpayment");
      costs.push(invoice.Amount.valueOf());

      setDescriptionDetails(desc);
      setPaymentTotals(costs);
    } else if (invoice.Description == "Annual Fee for Maintenance of Ancestor Tablet") {
      let desc = [];
      let costs = [];
      desc.push("Annual Fee for Maintenance of Ancestor Tablet");
      costs.push(invoice.Amount.valueOf());
      setDescriptionDetails(desc);
      setPaymentTotals(costs);
    } else if (invoice.Description == "Purchase of Tablet Leasing (Reserved)") {
      let desc = [];
      let costs = [];
      desc.push("Purchase of Tablet Cost");
      costs.push(tablet.PurchaseOfPlacementCost.valueOf());
      costs.push(tablet.TabletCost.valueOf());
      desc.push("Cost of Tablet");
      if (tablet.SelectionOfPlacementCost && tablet.SelectionOfPlacementCost.valueOf() > 0) {
        desc.push("Cost of Selection");
        costs.push(tablet.SelectionOfPlacementCost.valueOf());
      }
      if (tablet.JiLing && tablet.JiLing.valueOf() > 0) {
        desc.push("Cost of Ji Ling");
        costs.push(tablet.JiLing.valueOf());
      }
      if (tablet.OtherCost && tablet.OtherCost.valueOf() > 0) {
        desc.push("Others Cost");
        costs.push(tablet.OtherCost.valueOf());
      }
      setDescriptionDetails(desc);
      setPaymentTotals(costs);
    } else if (invoice.Description == "Monthly Installment") {
      let desc = [];
      let costs = [];
      if (invoice?.Month != undefined) {
        desc.push("Monthly Installment (" + monthNames[invoice.Month?.valueOf() - 1] + ") for Tablet");
      }
      else {
        desc.push("Monthly Installment for Tablet");
      }
      
      costs.push(invoice.Amount.valueOf());
      setDescriptionDetails(desc);
      setPaymentTotals(costs);
    } else if (invoice.Description == "Custom Payment") {
      let desc = [];
      let costs = [];
      if (invoice.AdditionalRemarks && invoice.AdditionalRemarks != "") {
        desc.push(invoice.AdditionalRemarks.toString());
      }
      else {
        desc.push("Custom Payment");
      }
      costs.push(invoice.Amount.valueOf())
      setDescriptionDetails(desc);
      setPaymentTotals(costs);
    }
    setCurrentInvoiceTabletApp(tablet);
    setViewInvoice(true);
  }
  async function updateInvoicePaymentData(): Promise<void> {
    try {
      const collectionRef = collection(db, "invoices");
      const documentID = invoice.InvoiceNo.toString();
      const docRef = doc(collectionRef, documentID);

      const tabletCollectionRef = collection(db, "tabletapplications");
      const tabletAppID = invoice.ApplicationID.toString();
      const tabletRef = doc(tabletCollectionRef, tabletAppID);

      const tabletMetadataCollectionRef = collection(db, "tablets");
      const tabletBlock = "Block" + invoice.Tablet_Number.charAt(0);
      const tabletMetadataRef = doc(tabletMetadataCollectionRef, tabletBlock);

      updateDoc(docRef, {
        ["IsPaid"]: true,
        ["Receipt_No"]: receiptNo.toString(),
      }).then(async () => {
        const tabletApp = await getDoc(tabletRef);
        const tabletAppData = tabletApp.data() as TabletApplication;
        if (invoice.IsPaid == false && tabletAppData.Application_Type == "TIP" && typeof tabletAppData.Outstanding_Amount === "number" && typeof tabletAppData.Number_of_Months === "number" && typeof invoice.Amount === "number" && tabletAppData.Outstanding_Amount - invoice.Amount < 1) {
          updateDoc(tabletRef, {
            ["Outstanding_Amount"]: 0,
            ["Number_of_Months"]: 0,
            ["Application_Type"]: "R",
          });

          updateDoc(tabletMetadataRef, {
            [invoice.Tablet_Number.toString()]: ["Reserved", ""],
          });
        } else if (invoice.IsPaid == false && tabletAppData.Application_Type == "TIP" && invoice.Description == "Monthly Installment" && typeof tabletAppData.Outstanding_Amount === "number" && typeof tabletAppData.Number_of_Months === "number" && typeof invoice.Amount === "number") {
          updateDoc(tabletRef, {
            ["Outstanding_Amount"]: tabletAppData.Outstanding_Amount - invoice.Amount,
            ["Number_of_Months"]: tabletAppData.Number_of_Months - 1,
          });
        } else if (invoice.IsPaid == false && tabletAppData.Application_Type == "TIP" && typeof tabletAppData.Outstanding_Amount === "number" && typeof tabletAppData.Number_of_Months === "number" && typeof invoice.Amount === "number") {
          updateDoc(tabletRef, {
            ["Outstanding_Amount"]: tabletAppData.Outstanding_Amount - invoice.Amount,
          });
        }
        toast({
          title: "Successful",
          description: "Invoices mark as paid with receipt number",
        });
        setDialogOpen(false);
        setTimeout(() => window.location.reload(), 500);
      });
    } catch (error) {
      toast({
        title: "Unsuccessful",
        description: "Issue marking invoice as paid, error: " + error,
      });
      setDialogOpen(false);
    }
  }

  function promptDeleteInvoice() {
    setAlertDialog(true);
  }

  function trulyDeleteInvoice() {
    try {
      const collectionRef = collection(db, "invoices");
      const documentID = invoice.InvoiceNo.toString();
      const docRef = doc(collectionRef, documentID);

      deleteDoc(docRef).then(() => {
        toast({
          title: "Successful",
          description: "Invoices deleted successfully",
        });
        setTimeout(() => window.location.reload(), 500);
      });
    } catch (error) {
      toast({
        title: "Unsuccessful",
        description: "Error deleting invoice: " + error,
      });
    }
  }

  function downloadPdf() {
    const content = downloadablePdfRef.current;

    if (content) {
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
          orientation: "portrait",
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth() + 30;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("invoice.pdf");
      });
    } else {
      console.log("No content in downloadable pdf");
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
      <Dialog open={viewInvoice} onOpenChange={setViewInvoice}>
        <DialogContent className="w-full flex flex-row justify-center lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl overflow-y-scroll max-h-[80vh]">
          <DialogHeader className="w-[1000px]">
            <div className="w-full" id="downloadablepdf" ref={downloadablePdfRef}>
              <div className="w-full temple-details flex flex-col justify-center mb-5">
                <div className="w-full temple-details-icon-and-name flex flex-row items-center justify-center">
                  <div className="temple-title flex flex-col items-center justify-center relative">
                    {/*eslint-disable-next-line @next/next/no-img-element*/}
                    <img src="/temple-icon.jpeg" alt="temple icon" className="h-[160px] w-[120px] mr-5 absolute -left-[150px]" />
                    <p className="text-5xl mb-5 pt-10">真空教本元山道堂</p>
                    <p className="text-2xl">CHIN KHONG POW POON GUAN SAN TOH TONG</p>
                    <p className="text-1xl">369 Pasir Panjang Road, Singapore 118706</p>
                    <p className="text-1xl">Tel: 67791237</p>
                  </div>
                </div>
              </div>
              <div className="invoice w-full flex flex-col items-center justify-center">
                <h1 className="text-4xl mb-8 font-bold">Invoice</h1>
                <div className="invoice-top grid grid-cols-2 gap-x-4 gap-y-12 mb-5">
                  <div className="invoice-payor p-3 w-[400px] flex flex-col items-center justify-start">
                    <p className="text-lg">{invoice.Payee_Name}</p>
                    <p>{invoice.Payee_Address}</p>
                  </div>
                  <div className="invoice-metadata border-2 border-black p-3 w-[300px]">
                    <p>
                      <b>Invoice No:</b> {invoice.InvoiceNo}
                    </p>
                    <p>
                      <b>Dated:</b> {new Date(invoice.Dated.toString()).toDateString()}
                    </p>
                    <p>
                      <b>Terms:</b> {invoice.Terms}
                    </p>
                    <p>
                      <b>LOTS No:</b> {invoice.Tablet_Number}
                    </p>
                  </div>
                  <div className="description h-[320px] w-[400px] border-2 border-black mr-3 relative">
                    <div className="w-full flex flex-row justify-center py-2 border-b-2 border-black">
                      <p className="font-bold">Description</p>
                    </div>
                    {descriptionDetails.map((description, index) => (
                      <div key={index}>
                      <p className="pl-2 pb-2" key={index}>{description}</p>
                      </div>
                    ))}
                    <br />

                    <div className="w-full flex flex-row justify-end py-2 pr-3 border-t-2 border-black absolute bottom-0">
                      <p className="font-bold">Total Amount:</p>
                    </div>
                  </div>
                  <div className="amount h-[320px] w-[300px] border-2 border-black relative">
                    <div className="w-full h-full flex flex-col relative">
                      <div className="w-full flex flex-row py-2 border-b-2 border-black">
                        <div className="w-2/6 flex flex-row justify-center">
                          <p className="font-bold">Amount</p>
                        </div>
                        <div className="w-4/6 flex flex-row justify-center">
                          <p className="font-bold">Year Positioned</p>
                        </div>
                      </div>
                      <div className="two-col h-full w-full flex flex-row">
                        <div className="col-1 h-full w-2/6 border-r-2 border-black">
                        {paymentTotals.map((cost, index) => (
                          <div key={index}>
                            {cost == 0 ? <p className="pl-2 pb-2" key={index}>&nbsp;</p> : <p className="pl-2 pb-2" key={index}>${cost}</p>}
                      </div>
                    ))}
                        </div>
                        <div className="col-2 h-full pb-[42px] w-4/6">
                          <div className="w-full h-full flex flex-row items-center justify-center">
                            <p>{invoice.Year_Positioned.toString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-row justify-start py-2 pl-3 border-t-2 border-black absolute bottom-0">
                        <p className="font-bold">${invoice.Amount.toString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {invoice.OutstandingMonth && invoice.OutstandingPayment && invoice.Description == "Monthly Installment" ? <p> Outstanding Amount: {invoice?.OutstandingPayment ? "$" + invoice?.OutstandingPayment.valueOf() : ""}, Remaining Installment Months: {invoice?.OutstandingMonth ? invoice?.OutstandingMonth.valueOf() : ""}</p>: <p></p>}
                {invoice.IsPaid && invoice.OutstandingMonth && invoice.OutstandingPayment && invoice.Description == "Installment Downpayment" ? <p> Outstanding Amount: {invoice?.OutstandingPayment ? "$" + invoice?.OutstandingPayment.valueOf() : ""}, Remaining Installment Months: {invoice?.OutstandingMonth ? invoice?.OutstandingMonth.valueOf() : ""}</p>: <p></p>}
          
              </div>
              <div className="contact-details w-full ml-[80px] flex flex-row mt-10">
                <div>
                  <div className="signature w-[200px] border-black border-b-2"></div>
                  <p>Signature</p>
                  <br />
                  <p>
                    <b>Treasurer:</b> Tan Hock Ann
                  </p>
                  <p>
                    <b>Mobile Phone:</b> 91052737
                  </p>
                </div>
                <div className="ml-[50px] max-w-[300px]">
                  <p className="mb-3">
                    <b>Bank Details</b>
                  </p>
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <p>
                    <b>Acc Name:</b> Chin Khong Kow Poon Guan San Toh Tong
                  </p>
                  <p>
                    <b>Bank Name:</b> UOB BANK
                  </p>
                  <p>
                    <b>Bank Acc No:</b> 3433007210
                  </p>
                  <p>
                    <b>PayNow UEN:</b> S99SS0091G
                  </p>
                </div>
                <div className="ml-[50px]">
                  <p className="mb-3">Paynow QR Code:</p>

                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img className="w-[150px] h-[150px]" src="./paynow.png" alt="paynow" />
                </div>
              </div>
            </div>
            <div className="w-full pb-10">
              <div className="w-full mt-3 flex flex-col items-center">
                <Button
                  onClick={() => {
                    downloadPdf();
                  }}
                  className="w-[180px]"
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Mark as Paid</DialogTitle>
            <DialogDescription>Mark invoice as paid and add receipt number.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="receiptNo" className="text-right">
                Receipt Number
              </Label>
              <Input
                id="receiptNo"
                value={receiptNo.toString()}
                onChange={(event) => {
                  setReceiptNo(event.target.value);
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => updateInvoicePaymentData()}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={alertDialog} onOpenChange={setAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the invoice.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => trulyDeleteInvoice()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={async () => {
            const hasEditPermission = await CheckEditPermission(currentUser);

            if (hasEditPermission) {
              setDialogOpen(true);
            } else {
              toast({
                title: "No Edit Permission",
                description: "Your current account has no edit permission",
              });
            }
          }}
        >
          Mark as Paid
        </DropdownMenuItem>
        <DropdownMenuItem onClick={async () => await updateDescriptionAndPaymentDetails()}>Download Invoice</DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            const hasEditPermission = await CheckEditPermission(currentUser);

            if (hasEditPermission) {
              promptDeleteInvoice();
            } else {
              toast({
                title: "No Edit Permission",
                description: "Your current account has no edit permission",
              });
            }
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

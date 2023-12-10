"use client";

import * as React from "react";
import { isEqual } from 'lodash';
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { DataTablePagination } from "../components/data-table-pagination";
import { DataTableToolbar } from "../components/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { TabletApplication, Invoice } from "@/app/data/dataTypes";

import { db } from "@/lib/firebase/firebase";
import { query, collection, getDocs, setDoc, doc } from "firebase/firestore"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
// async function pushMockDataToFirebase(apps: TabletApplication[]) {
//   apps.forEach(async (app: TabletApplication) => {
//     try {
//       await setDoc(doc(db, "tabletapplications", app.ApplicationID.toString()), app)
//       console.log("Successfully added:" + app.ApplicationID);
//     }
//     catch (error) {
//       console.log("Error adding mockdata" + error);
//     }
//   });
// }

function generateMockInvoice(application: TabletApplication) {
  const invoiceTypes = [
    "Purchase of Tablet Leasing (Normal)",
    "Annual Fee for Maintenance of Ancestor Tablet",
    "Purchase of Tablet (Special)"
  ];

  const randomInvoiceType = "Purchase of Tablet Leasing (Normal)";
  const randomInvoiceNo = `INV-${Math.floor(Math.random() * 1000)}`;
  const randomApplicationID = application.ApplicationID;
  const randomDated = application.Leasing_Date;
  const randomTerms = `${Math.floor(Math.random() * 30) + 1} Days`;
  const randomTabletNumber =  application.Tablet_Number;
  const randomPayeeName = application.Applicant_Name_English;
  const randomPayeeAddress = application.Applicant_Address;
  const randomFiscalYear = new Date().getFullYear();
  const randomReceiptNo = `RCPT-${Math.floor(Math.random() * 1000)}`;
  const randomAmount = 30;
  const randomYearPositioned = new Date().getFullYear();
  const randomIsPaid = true;

  const mockInvoice: Invoice = {
    InvoiceNo: randomInvoiceNo,
    ApplicationID: randomApplicationID,
    Dated: randomDated,
    Terms: randomTerms,
    Tablet_Number: randomTabletNumber,
    Payee_Name: randomPayeeName,
    Payee_Address: randomPayeeAddress,
    Description: randomInvoiceType,
    Fiscal_Year: randomFiscalYear,
    Receipt_No: randomReceiptNo,
    Amount: randomAmount,
    Year_Positioned: randomYearPositioned,
    IsPaid: randomIsPaid
  };

  return mockInvoice;
}


async function generateInvoicesData(data: TabletApplication[]) {
  data.forEach(async application => {
    try {
      let invoice: Invoice = await generateMockInvoice(application);
      await setDoc(doc(db, "invoices", invoice.InvoiceNo.toString()), invoice)
      console.log("Successfully added:" + invoice.InvoiceNo);
    }
    catch (error) {
      console.log("error added invoice to firebase");
    }
  });

}


export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  // Check localStorage on component mount
  React.useEffect(() => {
    const storedColumnVisibility = localStorage.getItem("columnVisibilitySettings");

    if (storedColumnVisibility) {
      try {
        const parsedVisibility = JSON.parse(storedColumnVisibility);
        // Set state only if the parsed value is valid
        setColumnVisibility(parsedVisibility);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        setColumnVisibility({});
        localStorage.setItem("columnVisibilitySettings", JSON.stringify({}));
      }
    }
  }, []);

  // Update localStorage when columnVisibility changes
  React.useEffect(() => {
    if (!isEqual(columnVisibility,{})) {
      localStorage.setItem("columnVisibilitySettings", JSON.stringify(columnVisibility));
    }
  }, [columnVisibility]);

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: (newColumnVisibility) => {
      // Update both state and localStorage when column visibility changes
      setColumnVisibility(newColumnVisibility);
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <Button onClick={() => generateInvoicesData(data as TabletApplication[])}> Generate Invoices to Firebase </Button>
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

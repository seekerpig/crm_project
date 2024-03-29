"use client";

import * as React from "react";
import { isEqual } from 'lodash';
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { DataTablePagination } from "../components/data-table-pagination";
import { DataTableToolbar } from "../components/data-table-toolbar";
import GenerateMaintenanceInvoiceModal  from "./generateMaintenanceInvoices";
import GenerateInstallmentInvoiceModal from "./generateInstallmentInvoices";
import GenerateManualInvoiceModal from "./generateManualInvoice";

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

  const [sorting, setSorting] = React.useState<SortingState>([
    // Set default sorting for the "Dated" column to be descending
    {
      id: "Dated",
      desc: true,
    },
  ]);

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
    <div className="">
      <GenerateMaintenanceInvoiceModal/>
      <GenerateInstallmentInvoiceModal/>
      <GenerateManualInvoiceModal/>
      <DataTableToolbar table={table}/>
      <div className="rounded-md border mt-3">
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

"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { Invoice} from "../../data/dataTypes";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Invoice>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" className="translate-y-[2px]" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" className="translate-y-[2px]" />,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "ApplicationID",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div>{row.getValue("ApplicationID")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Tablet_Number",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tablet No" />,
    cell: ({ row }) => <div>{row.getValue("Tablet_Number")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Dated",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dated" />,
    cell: ({ row }) => <div>{new Date(row.getValue("Dated")).toDateString()}</div>,
    enableSorting: true,
    enableHiding: true,
    sortDescFirst: false,
  },
  {
    accessorKey: "Description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Description")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Fiscal_Year",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fiscal_Year" />,
    cell: ({ row }) => <div>{row.getValue("Fiscal_Year")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Month",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Month" />,
    cell: ({ row }) => <div>{row.getValue("Month")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "InvoiceNo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="InvoiceNo" />,
    cell: ({ row }) => <div>{row.getValue("InvoiceNo")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "IsPaid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="IsPaid" />,
    cell: ({ row }) => <div>{Boolean(row.getValue("IsPaid")).toString()}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Payee_Address",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payee_Address" />,
    cell: ({ row }) => <div>{row.getValue("Payee_Address")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Payee_Name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payee_Name" />,
    cell: ({ row }) => <div>{row.getValue("Payee_Name")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Receipt_No",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Receipt_No" />,
    cell: ({ row }) => <div>{row.getValue("Receipt_No")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Terms",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Terms" />,
    cell: ({ row }) => <div>{row.getValue("Terms")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Year_Positioned",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Year_Positioned" />,
    cell: ({ row }) => <div>{row.getValue("Year_Positioned")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <div>{row.getValue("Amount")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

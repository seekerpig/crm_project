"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { TabletApplication } from "../../../data/dataTypes";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<TabletApplication>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" className="translate-y-[2px]" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" className="translate-y-[2px]" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ApplicationID",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div>{row.getValue("ApplicationID")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Tablet_Number",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tablet No" />,
    cell: ({ row }) => <div>{row.getValue("Tablet_Number")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "Leasing_Date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Leasing_Date" />,
    cell: ({ row }) => <div>{new Date(row.getValue("Leasing_Date")).toDateString()}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "Application_Type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Application_Type")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "Beneficiary1_Name_English",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Beneficiary1_Name_English" />,
    cell: ({ row }) => <div>{row.getValue("Beneficiary1_Name_English")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Beneficiary1_Name_Chinese",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Beneficiary1_Name_Chinese" />,
    cell: ({ row }) => <div>{row.getValue("Beneficiary1_Name_Chinese")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Beneficiary2_Name_English",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Beneficiary2_Name_English" />,
    cell: ({ row }) => <div>{row.getValue("Beneficiary2_Name_English")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Beneficiary2_Name_Chinese",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Beneficiary2_Name_Chinese" />,
    cell: ({ row }) => <div>{row.getValue("Beneficiary2_Name_Chinese")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Beneficiary3_Name_English",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Beneficiary3_Name_English" />,
    cell: ({ row }) => <div>{row.getValue("Beneficiary3_Name_English")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Beneficiary3_Name_Chinese",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Beneficiary3_Name_Chinese" />,
    cell: ({ row }) => <div>{row.getValue("Beneficiary3_Name_Chinese")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Applicant_Name_English",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applicant_Name_English" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Applicant_Name_English")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Applicant_Name_Chinese",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applicant_Name_Chinese" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Applicant_Name_Chinese")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Applicant_Gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applicant_Gender" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Applicant_Gender")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Applicant_Address",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applicant_Adddress" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Applicant_Address")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Applicant_IdentifiedCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applicant_IdentifiedCode" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Applicant_IdentifiedCode")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Applicant_Relationship",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applicant_Relationship" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Applicant_Relationship")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Applicant_ContactNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
    cell: ({ row }) => {
      return <div className="flex items-center">{row.getValue("Applicant_ContactNumber")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "SecondContact_Name_English",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SecondContact_Name_English" />,
    cell: ({ row }) => {
      return <div>{row.getValue("SecondContact_Name_English")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "SecondContact_Name_Chinese",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SecondContact_Name_Chinese" />,
    cell: ({ row }) => {
      return <div>{row.getValue("SecondContact_Name_Chinese")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "SecondContact_Address",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SecondContact_Address" />,
    cell: ({ row }) => {
      return <div>{row.getValue("SecondContact_Address")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "SecondContact_ContactNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="SecondContact_ContactNumber" />,
    cell: ({ row }) => {
      return <div>{row.getValue("SecondContact_ContactNumber")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Officer_In_Charge",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Officer_In_Charge" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Officer_In_Charge")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Amount_Received",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount_Received" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Amount_Received")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Receipt_No",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Receipt_No" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Receipt_No")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Payment_Comments",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payment_Comments" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Payment_Comments")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Remarks",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Remarks" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Remarks")}</div>;
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return <div>{row.getValue("Status")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Outstanding_Amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Outstanding_Amount" />,
    cell: ({ row }) => <div>{row.getValue("Outstanding_Amount")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "Number_of_Months",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Number_of_Months" />,
    cell: ({ row }) => <div>{row.getValue("Number_of_Months")}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

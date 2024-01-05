"use client";

import { ColumnDef } from "@tanstack/react-table";

import { User} from "../../data/dataTypes";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "User_ID",
    header: ({ column }) => <DataTableColumnHeader column={column} title="User_ID" />,
    cell: ({ row }) => <div>{row.getValue("User_ID")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div>{row.getValue("Email")}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "Permission",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Permission" />,
    cell: ({ row }) => <div>{row.getValue("Permission")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { descriptions, paymentSuccess } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between mt-3">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter || ''}
          onChange={(event) =>
            table.setGlobalFilter(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("IsPaid") && (
          <DataTableFacetedFilter
            column={table.getColumn("IsPaid")}
            title="Paid"
            options={paymentSuccess.map(option => ({ label: option.label, value: option.value.toString() }))}
          />
        )}
        {table.getColumn("Description") && (
          <DataTableFacetedFilter
            column={table.getColumn("Description")}
            title="Description"
            options={descriptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

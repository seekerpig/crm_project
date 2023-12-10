import React, { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function GenerateInvoiceModal(props: any) {
  const { invoiceData } = props;

  const currentYear = new Date().getFullYear();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currMonth); // Default to January

  const handleGenerateInvoices = () => {
    // Check if both year and month are selected
    if (selectedYear !== null && selectedMonth !== null) {
      // Call your function here with selectedYear and selectedMonth
      // For example:
      console.log("Generating invoices for:", selectedYear, selectedMonth);
    } else {
      // Handle the case where either year or month is not selected
      console.error("Please select both year and month");
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Generate Invoice</Button>
      </DialogTrigger>
      <DialogContent className="w-full flex">
        <DialogHeader className="w-full">
          <DialogTitle>Generate Invoices for Month and Year</DialogTitle>
          <div className="w-full flex flex-col">
          <Label htmlFor="year" className="mt-3 mb-1">Year:</Label>
          <Select id="year" defaultValue={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Year</SelectLabel>
                {Array.from({ length: 10 }, (_, index) => currentYear + 2 - index).map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label htmlFor="month" className="mb-1 mt-3">Month:</Label>
          <Select id="month" defaultValue={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Month</SelectLabel>
                {months.map((month, index) => (
                  <SelectItem key={index + 1} value={index + 1}>
                    {month}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="w-full mt-3">
            <Button className="mr-4" onClick={handleGenerateInvoices}>Generate Invoices</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
          <DialogDescription className="mt-3">This action cannot be undone.</DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateInvoiceModal;

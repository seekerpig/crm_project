"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { TabletApplication as TabletApplicationType } from "../../../data/dataTypes";
import { useState } from "react";
import TabletApplication from "../../../../components/TabletApplication";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const task: TabletApplicationType = row.original as TabletApplicationType;
  const [applicationForm, setApplicationForm] = useState(task);
  const [dialogOpen, setDialogOpen] = useState(false);
  function handleSaveTablet(){}
  async function updateApplication(application: TabletApplicationType){
    setApplicationForm(application);
    // to do update the row
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
          </DialogTrigger>
          <DialogContent className="w-full flex sm:max-w-[650px] sm:max-h-[800px]">
            <DialogHeader className="w-full">
              <TabletApplication
                ApplicationID={applicationForm?.ApplicationID || ""}
                Tablet_Number={applicationForm?.Tablet_Number || ""}
                Leasing_Date={applicationForm?.Leasing_Date || new Date()}
                Application_Type={applicationForm?.Application_Type || ""}
                Beneficiary1_Name_English={applicationForm?.Beneficiary1_Name_English || ""}
                Beneficiary1_Name_Chinese={applicationForm?.Beneficiary1_Name_Chinese || ""}
                Beneficiary2_Name_English={applicationForm?.Beneficiary2_Name_English || ""}
                Beneficiary2_Name_Chinese={applicationForm?.Beneficiary2_Name_Chinese || ""}
                Beneficiary3_Name_English={applicationForm?.Beneficiary3_Name_English || ""}
                Beneficiary3_Name_Chinese={applicationForm?.Beneficiary3_Name_Chinese || ""}
                Applicant_Name_English={applicationForm?.Applicant_Name_English || ""}
                Applicant_Name_Chinese={applicationForm?.Applicant_Name_Chinese || ""}
                Applicant_Gender={applicationForm?.Applicant_Gender || ""}
                Applicant_Address={applicationForm?.Applicant_Address || ""}
                Applicant_IdentifiedCode={applicationForm?.Applicant_IdentifiedCode || ""}
                Applicant_Relationship={applicationForm?.Applicant_Relationship || ""}
                Applicant_ContactNumber={applicationForm?.Applicant_ContactNumber || ""}
                Officer_In_Charge={applicationForm?.Officer_In_Charge || ""}
                PurchaseOfPlacementCost={applicationForm?.PurchaseOfPlacementCost || 0}
                TabletCost={applicationForm?.TabletCost || 0}
                SelectionOfPlacementCost={applicationForm?.SelectionOfPlacementCost || 0}
                TotalCostOfPurchase={applicationForm?.TotalCostOfPurchase || 0}
                Amount_Received={applicationForm?.Amount_Received || 0}
                Status={applicationForm?.Status || ""}
                Remarks={applicationForm?.Remarks || ""}
                Receipt_No={applicationForm?.Receipt_No || ""}
                onSave={handleSaveTablet}
                isEditable={false}
                updateApplication={updateApplication}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => setDialogOpen(true)}>View Form</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

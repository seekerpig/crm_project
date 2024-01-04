"use client";
import ErrorMessageNotLoggedIn from "@/components/ErrorMessageNotLoggedIn";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { collection, query, where, getDocs, doc, getDoc, writeBatch, addDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TabletApplication as TabletApplicationType } from "@/app/data/dataTypes";
import TabletApplication from "@/components/TabletApplication";
import { set } from "lodash";

const Home = () => {
  const [nric, setNric] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabApplications, setTabletApplications] = useState([] as TabletApplicationType[]);
  const [error, setError] = useState("");

  const searchTablet = async () => {
    setTabletApplications([]);
    setError("");
    const tabApplications = [] as TabletApplicationType[];
    const queryTabletApplications = query(collection(db, "tabletapplications"), where("Applicant_IdentifiedCode", "==", nric));
    const queryTabletApplicationsSnapshot = await getDocs(queryTabletApplications);
    if (queryTabletApplicationsSnapshot.empty) {
      setError("No matching documents.");
      return;
    }
    queryTabletApplicationsSnapshot.forEach((doc) => {
      tabApplications.push(doc.data() as TabletApplicationType);
    });
    setTabletApplications(tabApplications);
    if (tabApplications.length > 0) {
      setDialogOpen(true);
    }
  };

  return (
    <main className="">
      <ErrorMessageNotLoggedIn />
      <div className="container h-full">
        <div className="lg:p-8 lg:m-20 h-full ">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <p className="text-sm text-muted-foreground">Enter your NRIC to search for tablet</p>
            </div>
            <Input
              type="text"
              value={nric}
              placeholder="Identified Code/ NRIC"
              onChange={(e) => {
                setNric(e.target.value as string);
              }}
            />

            <Dialog open={dialogOpen && tabApplications.length > 0} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={searchTablet} className="w-full bg-primary text-white py-2 rounded-md">
                  Search
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full flex lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl overflow-y-scroll max-h-[80vh]">
                <DialogHeader className="">
                  <DialogTitle>List of tablet applications corresponding to ID</DialogTitle>
                  <div className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Application ID</TableHead>
                          <TableHead>Tablet Number</TableHead>
                          <TableHead>Beneficiary 1 English Name</TableHead>
                          <TableHead>Beneficiary 1 Chinese Name</TableHead>
                          <TableHead>Outstanding Amount</TableHead>
                          <TableHead>Number of Months</TableHead>
                          <TableHead>Manage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tabApplications.map((tabApplications) => (
                          <TableRow key={tabApplications.ApplicationID.toString()}>
                            <TableCell>{tabApplications.ApplicationID}</TableCell>
                            <TableCell>{tabApplications.Tablet_Number}</TableCell>
                            <TableCell>{tabApplications.Beneficiary1_Name_English}</TableCell>
                            <TableCell>{tabApplications.Beneficiary1_Name_Chinese}</TableCell>
                            <TableCell>{String(tabApplications.Outstanding_Amount)}</TableCell>
                            <TableCell>{tabApplications.Number_of_Months?.toString()}</TableCell>
                            <TableCell>
                              <Dialog>
                                {/* onclick fecth applicationTablet */}
                                <DialogTrigger asChild>
                                  <Button className="ml-3" variant="secondary">
                                    View form
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="w-full flex sm:max-w-[650px] sm:max-h-[800px]">
                                  <DialogHeader className="w-full">
                                    <TabletApplication
                                      ApplicationID={tabApplications?.ApplicationID || ""}
                                      Tablet_Number={tabApplications?.Tablet_Number || ""}
                                      Leasing_Date={tabApplications?.Leasing_Date || new Date()}
                                      Application_Type={tabApplications?.Application_Type || ""}
                                      Beneficiary1_Name_English={tabApplications?.Beneficiary1_Name_English || ""}
                                      Beneficiary1_Name_Chinese={tabApplications?.Beneficiary1_Name_Chinese || ""}
                                      Beneficiary2_Name_English={tabApplications?.Beneficiary2_Name_English || ""}
                                      Beneficiary2_Name_Chinese={tabApplications?.Beneficiary2_Name_Chinese || ""}
                                      Beneficiary3_Name_English={tabApplications?.Beneficiary3_Name_English || ""}
                                      Beneficiary3_Name_Chinese={tabApplications?.Beneficiary3_Name_Chinese || ""}
                                      Applicant_Name_English={tabApplications?.Applicant_Name_English || ""}
                                      Applicant_Name_Chinese={tabApplications?.Applicant_Name_Chinese || ""}
                                      Applicant_Gender={tabApplications?.Applicant_Gender || ""}
                                      Applicant_Address={tabApplications?.Applicant_Address || ""}
                                      Applicant_IdentifiedCode={tabApplications?.Applicant_IdentifiedCode || ""}
                                      Applicant_Relationship={tabApplications?.Applicant_Relationship || ""}
                                      Applicant_ContactNumber={tabApplications?.Applicant_ContactNumber || ""}
                                      Officer_In_Charge={tabApplications?.Officer_In_Charge || ""}
                                      Amount_Received={tabApplications?.Amount_Received || 0}
                                      Status={tabApplications?.Status || ""}
                                      Remarks={tabApplications?.Remarks || ""}
                                      Receipt_No={tabApplications?.Receipt_No || ""}
                                      onSave={() => {}}
                                      isEditable={false}
                                      updateApplication={(application: TabletApplication) => {
                                        // Handle the application update logic here
                                      }}
                                      Outstanding_Amount={tabApplications?.Outstanding_Amount || 0}
                                      Number_of_Months={tabApplications?.Number_of_Months || 0}
                                    />
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;

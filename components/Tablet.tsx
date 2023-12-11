"use client";
import { Tablet } from "@/app/data/dataTypes";
import { TabletApplication as TabletApplicationType} from "@/app/data/dataTypes";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import TabletApplication from "./TabletApplication";

function Tablet(props: Tablet) {
  const [newTablet, setNewTablet] = useState(props);
  const [status, setStatus] = useState(props.Status)
  const [statusColorClass, setNewStatusColorClass] = useState("");

  const [applicationForm, setApplicationForm] = useState<TabletApplication | undefined>(undefined);
  
  useEffect(() => {
    switch (newTablet.Status.toString()) {
      case "IPT":
        setNewStatusColorClass("bg-green-500"); // Green
        break;
      case "Reserved":
        setNewStatusColorClass("bg-yellow-500"); // Yellow
        break;
      case "Occupied":
        setNewStatusColorClass("bg-red-500"); // Red
        break;
      case "Blocked":
        setNewStatusColorClass("bg-purple-500"); // Purple
        break;
      default:
        setNewStatusColorClass(""); // Default color
    }
  }, [newTablet])
  
  async function handleStatusChange(s: string) {
    setStatus(s);
  }

  async function handleSaveTablet() {
    let appID: string | undefined = "";
    if (props.ApplicationID !== undefined) {
      appID = props.ApplicationID.toString();
    }
    let tablet: Tablet = {
      Tablet_Number: newTablet.Tablet_Number,
      Block: newTablet.Block,
      Row_Number: newTablet.Row_Number,
      Column_Number: newTablet.Column_Number,
      Status: status,
    };
    const data = {
      [props.Tablet_Number.toString()]: [status, appID],
    };
    const block = "Block" + props.Tablet_Number.charAt(0);

    try {
      const tabletDocRef = doc(db, "tablets", block);
      await updateDoc(tabletDocRef, data);
      console.log(`Document with ID ${block} written successfully.`);
      setNewTablet(tablet);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  //create fetch applicationtablet and check status if archived or head
  async function fetchApplicationTablet() {
    console.log("fetchApplicationTablet");
    // might change to application id instead of tablet number
    const q = query(collection(db, "tabletapplications"), where("Tablet_Number", "==", props.Tablet_Number), where("Status", "==", "Pending"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setApplicationForm(doc.data() as TabletApplication);

    });
 
  }

  return (
    <>
      {(props.Status !== "Not Available" && (
        <Dialog>
          {/* onclick fecth applicationTablet */}
          <DialogTrigger asChild>
            <div onClick={() => fetchApplicationTablet()} className={Number(props.Column_Number) === 2 && props.Block !== "D" ? "ml-7 " : Number(props.Column_Number) === 1 && props.Block === "D" ? "ml-7" : " "}>
              <div className={` ${props.Status === "Not Available" ? "w-[43px] h-[51px] px-3 pt-[25px] m-1" : `${statusColorClass} cursor-pointer w-[43px] h-[51px] px-3 pt-[25px] pb-1 border border-zinc-700 rounded shadow flex-col justify-end items-center inline-flex m-1 `}`}>{props.Status !== "Not Available" && <div>{props.Column_Number}</div>}</div>
            </div>
          </DialogTrigger>
          <DialogContent className="w-full flex sm:max-w-[650px] sm:max-h-[800px]">
            <DialogHeader className="w-full">
              <DialogTitle>
                Selected tablet is currently {newTablet.Status}:{" "}
                <div className={` ${statusColorClass} cursor-pointer w-[43px] h-[51px] px-3 pt-[25px] pb-1 border border-zinc-700 rounded shadow flex-col justify-end items-center inline-flex m-1 `}>
                  <div>{props.Column_Number}</div>
                </div>
              </DialogTitle>
              {/* if IPT or Occupied show the details */}
              
          
              {newTablet.Status === "IPT" || newTablet.Status === "Occupied" ? (
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
                    Amount_Received={applicationForm?.Amount_Received || 0}
                    Status={applicationForm?.Status || ""}
                    Remarks={applicationForm?.Remarks || ""}
                  />
              ) : (
                <div className="w-full flex flex-col">
                  {/* if available can change status */}
                  <Label htmlFor="changeStatus" className="mt-3 mb-1">
                    Change Status to:
                  </Label>
                  <Select defaultValue={newTablet.Status as string} onValueChange={(value: string) => handleStatusChange(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="Available">
                          <span className="bg-white text-black px-2 py-1 rounded-full border border-black">Available</span>
                        </SelectItem>
                        <SelectItem value="IPT">
                          <span className="bg-green-500 text-black px-2 py-1 rounded-full  ">IPT</span>
                        </SelectItem>
                        <SelectItem value="Reserved">
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded-full  ">Reserved</span>
                        </SelectItem>
                        <SelectItem value="Occupied">
                          <span className="bg-red-500 text-black px-2 py-1 rounded-full  ">Occupied</span>
                        </SelectItem>
                        <SelectItem value="Blocked">
                          <span className="bg-purple-500 text-black px-2 py-1 rounded-full ">Blocked</span>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {/* if select IPT or Occupied show a form to fill in */}
                  {status === "IPT" || status === "Occupied" ? (
                    <div className="w-full flex flex-col">
                      <Label htmlFor="details" className="mt-3 mb-1">
                        Details:
                      </Label>
                      <div className="w-full flex flex-row">
                        <div className="w-1/2 flex flex-col">
                          <Label htmlFor="applicationID" className="mt-3 mb-1">
                            Application ID:
                          </Label>
                          <div className="w-full flex flex-row">
                            <div className="w-full flex flex-col">
                              <Label htmlFor="applicationID" className="mt-3 mb-1">
                                <input type="text" id="applicationID" name="applicationID" className="w-full border border-zinc-700 rounded shadow p-2" />
                              </Label>
                            </div>
                          </div>
                        </div>
                        <div className="w-1/2 flex flex-col">
                          <Label htmlFor="applicationID" className="mt-3 mb-1">
                            Application Name:
                          </Label>
                          <div className="w-full flex flex-row">
                            <div className="w-full flex flex-col">
                              <Label htmlFor="applicationID" className="mt-3 mb-1">
                                <input type="text" id="applicationID" name="applicationID" className="w-full border border-zinc-700 rounded shadow p-2" />
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="w-full mt-3">
                    <Button className="mr-4" onClick={handleSaveTablet}>
                      Save
                    </Button>
                    <Button variant="secondary">Cancel</Button>
                  </div>
                  <DialogDescription className="mt-3">This action cannot be undone.</DialogDescription>
                </div>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )) || (
        <div>
          <div className={` ${statusColorClass}w-[43px] h-[51px] px-3 pt-[25px] pb-1 flex-col m-1`}></div>
        </div>
      )}
    </>
  );
}

export default Tablet;

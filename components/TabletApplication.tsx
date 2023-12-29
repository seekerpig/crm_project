import React from "react";
import { TabletApplication } from "@/app/data/dataTypes";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
// for view and creating new applications
//tabletapplication optional props
//status: string optional
//appId: string optional
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase/firebase";
import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { set } from "lodash";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function TabletApplication(props: TabletApplication & { onSave: () => void } & { isEditable: boolean } & { updateApplication: (application: TabletApplication) => void }) {
  const { onSave, updateApplication, isEditable, ...initialApplication } = props;
  const [isEditing, setIsEditing] = useState(isEditable);
  const [application, setApplication] = useState({ ...initialApplication });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const [checkFields, setCheckFields] = useState(false);
  const handleCheckFields = () => {
    setCheckFields(true);
    if (application.Applicant_Name_English != "" && application.Applicant_Name_English != "" && application.Applicant_Address!="" && application.Applicant_IdentifiedCode!="" && application.Applicant_Gender!="" && application.Applicant_Relationship!="" && application.Applicant_ContactNumber!="" && application.Officer_In_Charge!="" && Number(application.Amount_Received)>0 && application.Receipt_No!=""){
      setCheckFields(false)
      handleSaveClick()
    }
  };
  const handleSaveClick = async () => {
    // Add logic to save the edited data to your database or state
    const data = {
      ...application,
    };

    // edit the data
    if (application.ApplicationID) {
      try {
        const tabletDocRef = doc(db, "tabletapplications", application.ApplicationID.toString());
        await updateDoc(tabletDocRef, data);
        console.log(`Document with ID ${application.ApplicationID.toString()} written successfully.`);
        // setApplication(application);
        props.updateApplication(application);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
    // create new data
    else {
      const newdata = {
        ...data,
        Status: "Pending",
        Leasing_Date: application.Leasing_Date.toString(),
      };
      try {
        const docRef = await addDoc(collection(db, "tabletapplications"), newdata);
        await updateDoc(docRef, { ApplicationID: docRef.id });
        props.onSave();
        setApplication({ ...application, ApplicationID: docRef.id });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }

    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    // Add logic to delete the data from your database or state
    if (application.ApplicationID) {
      try {
        const tabletDocRef = doc(db, "tabletapplications", application.ApplicationID.toString());
        await updateDoc(tabletDocRef, { Status: "archive" });
        console.log(`Document with ID ${application.ApplicationID.toString()} archive successfully.`);
        
        const data = {
          ApplicationID: "",
          Tablet_Number: application.Tablet_Number,
          Leasing_Date: new Date(),
          Application_Type: "",
          Beneficiary1_Name_English: "",
          Beneficiary1_Name_Chinese: "",
          Beneficiary2_Name_English: "",
          Beneficiary2_Name_Chinese: "",
          Beneficiary3_Name_English: "",
          Beneficiary3_Name_Chinese: "",
          Applicant_Name_English: "",
          Applicant_Name_Chinese: "",
          Applicant_Gender: "",
          Applicant_Address: "",
          Applicant_IdentifiedCode: "",
          Applicant_Relationship: "",
          Applicant_ContactNumber: "",
          SecondContact_Name_English: "",
          SecondContact_Name_Chinese: "",
          SecondContact_Address: "",
          SecondContact_ContactNumber: "",
          Officer_In_Charge: "",
          Amount_Received: 0,
          Receipt_No: "",
          Payment_Comments: "",
          Remarks: "",
          Status: "",
        };
        setApplication(data);
        props.updateApplication(data);
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  }

  return (
    <>
      {isEditing ? (
        <div>
          <Button onClick={handleCheckFields}>Save</Button>
        </div>
      ) : (
        <div>
          <Button onClick={handleEditClick} className="me-3">Edit</Button>
          <Button onClick={handleDeleteClick}>Archive</Button>
        </div>
      )}
      <div className="overflow-y-auto ">
        <table className="w-full">
          <tbody>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Tablet Number / 神主号码</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                <span>{application.Tablet_Number}</span>
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Leasing Date</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                <span>{String(application.Leasing_Date).substring(0, 10)}</span>
              </td>
            </tr>
            <tr className="h-5"></tr>
            <tr className="border border-gray-300 ">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>1) Beneficiary Name/英文名*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Beneficiary1_Name_English as string}
                    onChange={(e) => {
                      setApplication({ ...application, Beneficiary1_Name_English: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Beneficiary1_Name_English}</span>
                )}
                {checkFields && application.Beneficiary1_Name_English == "" && <p className="text-sm text-red-500"> Please enter beneficiary name</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>受益人姓名/ 中文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Beneficiary1_Name_Chinese as string}
                    onChange={(e) => {
                      setApplication({ ...application, Beneficiary1_Name_Chinese: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Beneficiary1_Name_Chinese}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>2) Beneficiary Name/英文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Beneficiary2_Name_English as string}
                    onChange={(e) => {
                      setApplication({ ...application, Beneficiary2_Name_English: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Beneficiary2_Name_English}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>受益人姓名/ 中文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Beneficiary2_Name_Chinese as string}
                    onChange={(e) => {
                      setApplication({ ...application, Beneficiary2_Name_Chinese: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Beneficiary2_Name_Chinese}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>3) Beneficiary Name/英文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Beneficiary3_Name_English as string}
                    onChange={(e) => {
                      setApplication({ ...application, Beneficiary3_Name_English: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Beneficiary3_Name_English}</span>
                )}
              </td>
            </tr>
            <tr className=" border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>受益人姓名/ 中文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Beneficiary3_Name_Chinese as string}
                    onChange={(e) => {
                      setApplication({ ...application, Beneficiary3_Name_Chinese: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Beneficiary3_Name_Chinese}</span>
                )}
              </td>
            </tr>
            <tr className="h-5"></tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Applicant Name/ 英文名*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Applicant_Name_English as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_Name_English: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_Name_English}</span>
                )}
                {checkFields && application.Applicant_Name_English == "" && <p className="text-sm text-red-500"> Please enter applicant name</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>申请姓名/ 中文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Applicant_Name_Chinese as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_Name_Chinese: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_Name_Chinese}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Address/ 地址*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Applicant_Address as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_Address: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_Address}</span>
                )}
                {checkFields && application.Applicant_Address == "" && <p className="text-sm text-red-500"> Please enter address</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Indentified Code /*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Applicant_IdentifiedCode as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_IdentifiedCode: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_IdentifiedCode}</span>
                )}
                {checkFields && application.Applicant_IdentifiedCode == "" && <p className="text-sm text-red-500"> Please enter Identified Code</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Gender / 性别*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                <Select value={application.Applicant_Gender as string} onValueChange={(e) => {
                  setApplication({ ...application, Applicant_Gender: e as string });
                }}>
                  {/* Select trigger button */}
                  <SelectTrigger>
                    {/* Display selected value or default text */}
                    {application.Applicant_Gender || "Select Gender"}
                  </SelectTrigger>

                  {/* Select content/options */}
                  <SelectContent>
                    {/* Option for "Male" */}
                    <SelectItem value="Male">Male</SelectItem>

                    {/* Option for "Female" */}
                    <SelectItem value="Female">Female</SelectItem>

                    {/* Add more options as needed */}
                  </SelectContent>
                </Select>
                ) : (
                  <span>{application.Applicant_Gender}</span>
                )}
                {checkFields && application.Applicant_Gender == "" && <p className="text-sm text-red-500"> Please specify Gender</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Relationship/与受益人的关*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Applicant_Relationship as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_Relationship: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_Relationship}</span>
                )}
                {checkFields && application.Applicant_Relationship == "" && <p className="text-sm text-red-500"> Please specify relationship</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Telephone Nos/Home or Mobile*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Applicant_ContactNumber as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_ContactNumber: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_ContactNumber}</span>
                )}
                {checkFields && application.Applicant_ContactNumber == "" && <p className="text-sm text-red-500"> Please enter contact number</p>}
              </td>
            </tr>
            <tr className="h-5"></tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>For Admin Use</strong>
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Officer in Charge/ 管理员姓名*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Officer_In_Charge as string}
                    onChange={(e) => {
                      setApplication({ ...application, Officer_In_Charge: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Officer_In_Charge}</span>
                )}
                {checkFields && application.Officer_In_Charge == "" && <p className="text-sm text-red-500"> Please enter officer in charge</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Amount received/收到金额*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="Number"
                    value={application.Amount_Received.toString()}
                    onChange={(e) => {
                      setApplication({ ...application, Amount_Received: parseFloat(e.target.value) });
                    }}
                  />
                ) : (
                  <span>{application.Amount_Received.toString()}</span>
                )}
                {checkFields && application.Amount_Received.valueOf() <= 0 && <p className="text-sm text-red-500"> Please enter valid amount</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Receipt Nos/收据号码*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.Receipt_No?.toString()}
                    onChange={(e) => {
                      setApplication({ ...application, Receipt_No: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Receipt_No}</span>
                )}
                {checkFields && application.Receipt_No == "" && <p className="text-sm text-red-500"> Please enter receipt number</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Other</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Payment_Comments?.toString()}
                    onChange={(e) => {
                      setApplication({ ...application, Payment_Comments: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Payment_Comments}</span>
                )}
              </td>
            </tr>
            <tr className="h-5"></tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Remarks</strong>
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={2} className="h-20 p-1 w-64">
                {isEditing ? (
                  <Textarea
                    value={application.Remarks?.toString()}
                    onChange={(e) => {
                      setApplication({ ...application, Remarks: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Remarks}</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TabletApplication;

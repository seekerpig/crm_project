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



function TabletApplication(props: TabletApplication & { onSave: () => void } & {isEditable: boolean}) {
  const { onSave, isEditable, ...initialApplication} = props;
  const [isEditing, setIsEditing] = useState(isEditable);
  const [application, setApplication] = useState({...initialApplication});

  // useEffect(() => {
  //   setApplication({...initialApplication});
  //   if (application.ApplicationID === "") {
  //     console.log(application.ApplicationID);
  //     setIsEditing(true);
  //   }
  //   else{
  //     setIsEditing(false);
  //   }
  // }, [application.ApplicationID, props]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    // Add logic to save the edited data to your database or state
    const data = {
      ...application,
      Status: "Pending",
      Leasing_Date: application.Leasing_Date.toString()
    };
    
    // edit the data
    if (application.ApplicationID){
      try {
        const tabletDocRef = doc(db, "tabletapplications", application.ApplicationID.toString());
        await updateDoc(tabletDocRef, data);
        console.log(`Document with ID ${application.ApplicationID.toString()} written successfully.`);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
    // create new data
    else{
      try {
        const docRef = await addDoc(collection(db, "tabletapplications"), data);
        await updateDoc(docRef, { ApplicationID: docRef.id });  
        props.onSave()
        setApplication({ ...application, ApplicationID: docRef.id });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }

    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <div>
          <Button onClick={handleSaveClick}>Save</Button>
        </div>
      ) : (
        <div>
          <Button onClick={handleEditClick}>Edit</Button>
        </div>
      )}
      <div className="overflow-y-auto ">
        <table className="w-full ">
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
                <strong>1) Beneficiary Name/英文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Beneficiary1_Name_English as string}
                    onChange={(e) => {
                      setApplication({ ...application, Beneficiary1_Name_English: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Beneficiary1_Name_English}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>受益人姓名/ 中文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
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
                  <input
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
                  <input
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
                  <input
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
                  <input
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
                <strong>Applicant Name/ 英文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Applicant_Name_English as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_Name_English: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_Name_English}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>申请姓名/ 中文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
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
                <strong>Address/ 地址</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Applicant_Address as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_Address: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_Address}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Indentified Code /</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Applicant_IdentifiedCode as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_IdentifiedCode: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_IdentifiedCode}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Gender / 性别</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Applicant_Gender as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_Gender: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_Gender}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Relationship/与受益人的关</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Applicant_Relationship as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_Relationship: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_Relationship}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Telephone Nos/Home or Mobile</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Applicant_ContactNumber as string}
                    onChange={(e) => {
                      setApplication({ ...application, Applicant_ContactNumber: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Applicant_ContactNumber}</span>
                )}
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
                <strong>Officer in Charge/ 管理员姓名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Officer_In_Charge as string}
                    onChange={(e) => {
                      setApplication({ ...application, Officer_In_Charge: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Officer_In_Charge}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Amount received/收到金额</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Amount_Received.toString()}
                    onChange={(e) => {
                      setApplication({ ...application, Amount_Received: parseFloat(e.target.value) });
                    }}
                  />
                ) : (
                  <span>{application.Amount_Received.toString()}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Receipt Nos/收据号码</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <input
                    type="text"
                    value={application.Receipt_No?.toString()}
                    onChange={(e) => {
                      setApplication({ ...application, Receipt_No: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.Receipt_No}</span>
                )}
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

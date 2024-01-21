import React, { useRef } from "react";
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
import { CreateInvoiceAsPaid } from "@/app/invoicemanagement/components/generateManualInvoice";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/context/AuthProvider";
import CheckEditPermission from "@/components/CheckEditPermission";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { stat } from "fs";
import { set } from "lodash";

function TabletApplication(props: TabletApplication & { onSave: () => void } & { isEditable: boolean } & { updateApplication: (application: TabletApplication) => void }) {
  const { onSave, updateApplication, isEditable, ...initialApplication } = props;
  const [isEditing, setIsEditing] = useState(isEditable);
  const [application, setApplication] = useState({
    ...initialApplication,
    TabletCost: initialApplication.TabletCost || 0,
    PurchaseOfPlacementCost: initialApplication.PurchaseOfPlacementCost || 0,
    SelectionOfPlacementCost: initialApplication.SelectionOfPlacementCost || 0,
  });
  const [oldApplication, setOldApplication] = useState({ ...initialApplication });
  const { toast } = useToast();
  const currentUser = useAuth();

  const downloadablePdfRef = useRef(null);
  const downloadablePdfRef2 = useRef(null);
  function downloadPdf() {
    const content = downloadablePdfRef.current;
    const content2 = downloadablePdfRef2.current;

    if (content && content2) {
      const pdf = new jsPDF({
        orientation: "portrait",
      });
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        html2canvas(content2).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
  
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("document.pdf");
        });
      });


    } else {
      console.log("No content in downloadable pdf");
    }
  }
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const [checkFields, setCheckFields] = useState(false);
  const handleCheckFields = () => {
    setCheckFields(true);
    if (application.Applicant_Name_English != "" && application.Applicant_Name_English != "" && application.Applicant_Address != "" && application.Applicant_IdentifiedCode != "" && application.Applicant_Gender != "" && application.Applicant_Relationship != "" && application.Applicant_ContactNumber != "" && application.Officer_In_Charge != "" && Number(application.Amount_Received) > 0 && application.Receipt_No != "" && Number(application.PurchaseOfPlacementCost) > 0 && Number(application.TabletCost) > 0) {
      if (application.Application_Type === "TIP" && Number(application.Number_of_Months) > 0 && Number(application.Outstanding_Amount) >= 0) {
        setCheckFields(false);
        handleSaveClick();
      } else if (application.Application_Type !== "TIP" && Number(application.Outstanding_Amount) == 0) {
        setCheckFields(false);
        handleSaveClick();
      }
    }
  };
  const handleSaveClick = async () => {
    // Add logic to save the edited data to your database or state

    // edit the data
    if (application.ApplicationID) {
      try {
        const updatedApplication = {
          ...application,
        };
        if (status !== "Reserved") {
          if (status === "Occupied (S)") {
            updatedApplication.Application_Type = "S";
            console.log("Occupied (S)");
          } else if (status === "Occupied (N)") {
            updatedApplication.Application_Type = "N";
          }
          setApplication(updatedApplication);
        }

        console.log(status);
        console.log(updatedApplication.Application_Type);
        console.log(updatedApplication.ApplicationID.toString());
        const tabletDocRef = doc(db, "tabletapplications", updatedApplication.ApplicationID.toString());
        await updateDoc(tabletDocRef, updatedApplication);
        console.log(`Document with ID ${updatedApplication.ApplicationID.toString()} written successfully.`);
        props.updateApplication(updatedApplication);
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
    // create new data
    else {
      const updatedApplication = {
        ...application,
        Status: "Current",
        Leasing_Date: application.Leasing_Date.toString(),
      };

      try {
        const docRef = await addDoc(collection(db, "tabletapplications"), updatedApplication);
        await updateDoc(docRef, { ApplicationID: docRef.id });
        updatedApplication.ApplicationID = docRef.id;
        setApplication(updatedApplication);
        props.updateApplication(updatedApplication);
        props.onSave();
        console.log(`Document with ID ${docRef.id} written successfully.`);
        CreateInvoiceAsPaid(updatedApplication.Tablet_Number.toString(), updatedApplication.Amount_Received.valueOf(), updatedApplication.Application_Type.toString(), updatedApplication.Leasing_Date);
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
        await updateDoc(tabletDocRef, { Status: "Archive" });
        console.log(`Document with ID ${application.ApplicationID.toString()} archive successfully.`);

        const data = {
          ApplicationID: "",
          Tablet_Number: application.Tablet_Number,
          Leasing_Date: "",
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
          SecondContact_Relationship: "",
          SecondContact_IdentifiedCode: "",
          SecondContact_Gender: "",
          Officer_In_Charge: "",
          Amount_Received: 0,
          PurchaseOfPlacementCost: 0,
          TabletCost: 0,
          SelectionOfPlacementCost: 0,
          Receipt_No: "",
          Payment_Comments: "",
          Remarks: "",
          Status: "",
          Number_of_Months: 0,
          Outstanding_Amount: 0,
          TotalCostOfPurchase: 0,
        };
        setApplication(data);
        props.updateApplication(data);
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  const handleCopy = async () => {
    // Add logic to delete the data from your database or state
    const data = {
      ...oldApplication,
      Status: "Archive",
    };
    if (application.ApplicationID) {
      try {
        const tabletDocRef = doc(db, "tabletapplications", application.ApplicationID.toString());
        await updateDoc(tabletDocRef, data);
        console.log(`Document with ID ${application.ApplicationID.toString()} written successfully.`);
        setOldApplication(application);
        const newdata = {
          ...application,
          Status: "Current",
          Leasing_Date: application.Leasing_Date.toString(),
          applicationID: "",
        };
        try {
          const docRef = await addDoc(collection(db, "tabletapplications"), newdata);
          await updateDoc(docRef, { ApplicationID: docRef.id });
          console.log(`Document with ID ${docRef.id} written successfully.`);
          setApplication({ ...application, ApplicationID: docRef.id });
          props.onSave();
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      } catch (error) {
        console.error("Error copying document: ", error);
      }
    }
    setIsEditing(false);
  };

  const [status, setStatus] = useState("Reserved");
  return (
    <>
      {isEditing ? (
        <div>
          <Button onClick={handleCheckFields} className="me-3">
            Save
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>{application.ApplicationID !== "" && <Button>Save as New Form</Button>}</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. This will save the new information to a new form and archive the current form</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCopy}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        application.Status !== "Archive" && (
          <div>
            <Button
              onClick={async () => {
                const hasEditPermission = await CheckEditPermission(currentUser);
                if (hasEditPermission) {
                  handleEditClick();
                } else {
                  toast({
                    title: "No Edit Permission",
                    description: "Your current account has no edit permission",
                  });
                }
              }}
              className="me-3"
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="me-3">Archive</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone. This will archive the current form and set the tablet to available</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const hasEditPermission = await CheckEditPermission(currentUser);
                      if (hasEditPermission) {
                        handleDeleteClick();
                      } else {
                        toast({
                          title: "No Edit Permission",
                          description: "Your current account has no edit permission",
                        });
                      }
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="me-3">View PDF</Button>
              </DialogTrigger>
              <DialogContent className="w-full flex flex-row justify-center lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl overflow-y-scroll max-h-[80vh]">
                <DialogHeader className="w-[1000px]">
                  <div className="w-full" id="downloadablepdf" ref={downloadablePdfRef}>
                    <div className="w-full temple-details flex flex-col justify-center mb-5">
                      <div className="w-full temple-details-icon-and-name flex flex-row items-center justify-center">
                        {/*eslint-disable-next-line @next/next/no-img-element*/}
                        <img src="/temple-icon.jpeg" alt="temple icon" className="h-[160px] w-[120px] mr-5" />
                        <div className="temple-title flex flex-col items-center justify-center">
                          <p className="text-5xl mb-5 pt-10">真空教本元山道堂</p>
                          <p className="text-2xl">CHIN KHONG POW POON GUAN SAN TOH TONG</p>
                          <p className="text-1xl">369 Pasir Panjang Road, Singapore 118706</p>
                          <p className="text-1xl">Tel: 67791237</p>
                          <p className="text-2xl mt-2">Hall of Merits Application Form</p>
                          <p className="text-2xl mb-2">功德堂申请表格</p>
                        </div>
                      </div>
                    </div>
                    <div className="invoice w-full flex flex-col items-center justify-center">
                      <table className="w-3/4">
                        <tbody>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Tablet Number / 神主号码</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Tablet_Number}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Leasing Date</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{String(application.Leasing_Date).substring(0, 10)}</span>
                            </td>
                          </tr>
                          <tr className="h-5"></tr>
                          <tr className="border border-gray-300 ">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>1) Beneficiary Name/英文名*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Beneficiary1_Name_English}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>受益人姓名/ 中文名</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Beneficiary1_Name_Chinese}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>2) Beneficiary Name/英文名</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Beneficiary2_Name_English}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>受益人姓名/ 中文名</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Beneficiary2_Name_Chinese}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>3) Beneficiary Name/英文名</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Beneficiary3_Name_English}</span>
                            </td>
                          </tr>
                          <tr className=" border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>受益人姓名/ 中文名</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Beneficiary3_Name_Chinese}</span>
                            </td>
                          </tr>
                          <tr className="h-5"></tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Applicant Name/ 英文名*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Applicant_Name_English}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>申请姓名/ 中文名</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Applicant_Name_Chinese}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Address/ 地址*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Applicant_Address}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Indentified Code /*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Applicant_IdentifiedCode}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Gender / 性别*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Applicant_Gender}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Relationship/与受益人的关*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Applicant_Relationship}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Telephone Nos/Home or Mobile*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Applicant_ContactNumber}</span>
                            </td>
                          </tr>

                          <tr className="h-5"></tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Second Contact Name/ 英文名</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.SecondContact_Name_English}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>第二联系姓名/ 中文名</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.SecondContact_Name_Chinese}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Address/ 地址</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.SecondContact_Address}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Indentified Code </strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.SecondContact_IdentifiedCode}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Gender / 性别</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.SecondContact_Gender}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Relationship/与受益人的关</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.SecondContact_Relationship}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Telephone Nos/Home or Mobile</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.SecondContact_ContactNumber}</span>
                            </td>
                          </tr>

                          <tr className="h-5"></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <hr></hr>
                  <div className="w-full" id="downloadablepdf2" ref={downloadablePdfRef2}>
                    <div className="my-20"></div>
                    <div className="invoice w-full flex flex-col items-center justify-center">
                      <table className="w-3/4">
                        <tbody>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>For Admin Use</strong>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Officer in Charge/ 管理员姓名*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Officer_In_Charge}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Purchase of placement*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.PurchaseOfPlacementCost?.toString()}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Tablet Cost*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.TabletCost?.toString()}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Selection of placement</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.SelectionOfPlacementCost?.toString()}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Total cost of purchase</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.TotalCostOfPurchase?.toString()}</span>
                            </td>
                          </tr>
                          {application.Application_Type == "TIP" && (
                            <>
                              <tr className="border border-gray-300">
                                <td colSpan={1} className="border border-gray-300 p-2">
                                  <strong>Number of Months*</strong>
                                </td>
                                <td colSpan={1} className="p-1 w-64">
                                  <span>{application.Number_of_Months?.toString()}</span>
                                </td>
                              </tr>
                            </>
                          )}
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Outstanding Amount</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Outstanding_Amount?.toString()}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Amount received/收到金额*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Amount_Received.toString()}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Receipt Nos/收据号码*</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Receipt_No}</span>
                            </td>
                          </tr>
                          <tr className="border border-gray-300">
                            <td colSpan={1} className="border border-gray-300 p-2">
                              <strong>Other</strong>
                            </td>
                            <td colSpan={1} className="p-1 w-64">
                              <span>{application.Payment_Comments}</span>
                            </td>
                          </tr>
                          <tr className="h-5"></tr>
                        </tbody>
                      </table>

                      <div className="w-3/4 flex mt-20 mb-5">
                        <div className="text-center flex-auto">
                          <div className="signature border-black border-b-2"></div>
                          <p>Applicant&apos;s  Signature</p>
                          <p>申请人签名</p>
                        </div>
                        <div className="flex-auto text-center">
                          <p>CKKPGSTT</p>
                          <p>Stamp/ 道堂印章</p>
                        </div>
                        <div className="text-center flex-auto">
                          <div className="signature border-black border-b-2"></div>
                          <p>Officer&apos;s Signature / Name</p>
                          <p>管理员签名</p>
                        </div>
                      </div>
                      <table className="w-3/4">
                        <tr className="border border-gray-300">
                          <td colSpan={1} className="border border-gray-300 p-2">
                            <strong>Remarks</strong>
                          </td>
                        </tr>
                        <tr className="border border-gray-300">
                          <td colSpan={2} className="h-20 p-1 w-64">
                            <span>{application.Remarks}</span>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  <div className="w-full pb-10">
                    <div className="w-full mt-3 flex flex-col items-center">
                      <Button
                        onClick={() => {
                          downloadPdf();
                        }}
                        className="w-[180px]"
                      >
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )
      )}

      <div className="overflow-y-auto ">
        {application.Application_Type == "R" && application.ApplicationID && isEditing && (
          <div className="my-2">
            <Label htmlFor="changeStatus" className="mt-3 mb-1">
              Change Status to:
            </Label>
            <Select
              defaultValue={status as string}
              onValueChange={(value: string) => {
                setStatus(value);
              }}
              value={status.toString()}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="Reserved">
                    <span className="bg-yellow-200 font-bold text-black px-2 py-1 rounded-full  ">Reserved</span>
                  </SelectItem>
                  <SelectItem value="Occupied (S)">
                    <span className="bg-red-300 font-bold text-black px-2 py-1 rounded-full  ">Occupied (S)</span>
                  </SelectItem>
                  <SelectItem value="Occupied (N)">
                    <span className="bg-red-300 font-bold text-black px-2 py-1 rounded-full  ">Occupied (N)</span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
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
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !application.Leasing_Date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {application.Leasing_Date ? format(new Date(application.Leasing_Date as string), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar mode="single" selected={application.Leasing_Date ? new Date(application.Leasing_Date as string) : undefined} onSelect={(date) => setApplication({ ...application, Leasing_Date: date?.toString() || "" })} initialFocus />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <span>{String(application.Leasing_Date).substring(0, 10)}</span>
                )}
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
                  <Select
                    value={application.Applicant_Gender as string}
                    onValueChange={(e) => {
                      setApplication({ ...application, Applicant_Gender: e as string });
                    }}
                  >
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
                <strong>Second Contact Name/ 英文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.SecondContact_Name_English as string}
                    onChange={(e) => {
                      setApplication({ ...application, SecondContact_Name_English: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.SecondContact_Name_English}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>第二联系姓名/ 中文名</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.SecondContact_Name_Chinese as string}
                    onChange={(e) => {
                      setApplication({ ...application, SecondContact_Name_Chinese: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.SecondContact_Name_Chinese}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Address/ 地址</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.SecondContact_Address as string}
                    onChange={(e) => {
                      setApplication({ ...application, SecondContact_Address: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.SecondContact_Address}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Indentified Code </strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.SecondContact_IdentifiedCode as string}
                    onChange={(e) => {
                      setApplication({ ...application, SecondContact_IdentifiedCode: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.SecondContact_IdentifiedCode}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Gender / 性别</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Select
                    value={application.SecondContact_Gender as string}
                    onValueChange={(e) => {
                      setApplication({ ...application, SecondContact_Gender: e as string });
                    }}
                  >
                    {/* Select trigger button */}
                    <SelectTrigger>
                      {/* Display selected value or default text */}
                      {application.SecondContact_Gender || "Select Gender"}
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
                  <span>{application.SecondContact_Gender}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Relationship/与受益人的关</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.SecondContact_Relationship as string}
                    onChange={(e) => {
                      setApplication({ ...application, SecondContact_Relationship: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.SecondContact_Relationship}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Telephone Nos/Home or Mobile</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="text"
                    value={application.SecondContact_ContactNumber as string}
                    onChange={(e) => {
                      setApplication({ ...application, SecondContact_ContactNumber: e.target.value as string });
                    }}
                  />
                ) : (
                  <span>{application.SecondContact_ContactNumber}</span>
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
                <strong>Purchase of placement*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="Number"
                    value={application.PurchaseOfPlacementCost?.toString()}
                    onChange={(e) => {
                      const tabletCost = Number(application.TabletCost) || 0;
                      const purchaseCost = Number(e.target.value) || 0;
                      const SelectionOfPlacementCost = Number(application.SelectionOfPlacementCost) || 0;
                      const amountReceived = Number(application.Amount_Received) || 0;
                      const outAmt = tabletCost + purchaseCost + SelectionOfPlacementCost - amountReceived;
                      const totalcost = tabletCost + purchaseCost + SelectionOfPlacementCost;
                      setApplication({ ...application, PurchaseOfPlacementCost: parseFloat(e.target.value), Outstanding_Amount: outAmt, TotalCostOfPurchase: totalcost });
                    }}
                  />
                ) : (
                  <span>{application.PurchaseOfPlacementCost?.toString()}</span>
                )}
                {checkFields && (application.PurchaseOfPlacementCost?.valueOf() ?? 0) <= 0 && <p className="text-sm text-red-500"> Please enter valid amount</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Tablet Cost*</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="Number"
                    value={application.TabletCost?.toString()}
                    onChange={(e) => {
                      const tabletCost = Number(e.target.value) || 0;
                      const purchaseCost = Number(application.PurchaseOfPlacementCost) || 0;
                      const SelectionOfPlacementCost = Number(application.SelectionOfPlacementCost) || 0;
                      const amountReceived = Number(application.Amount_Received) || 0;
                      const outAmt = tabletCost + purchaseCost + SelectionOfPlacementCost - amountReceived;
                      const totalcost = tabletCost + purchaseCost + SelectionOfPlacementCost;
                      setApplication({ ...application, TabletCost: parseFloat(e.target.value), Outstanding_Amount: outAmt, TotalCostOfPurchase: totalcost });
                    }}
                  />
                ) : (
                  <span>{application.TabletCost?.toString()}</span>
                )}
                {checkFields && (application.TabletCost?.valueOf() ?? 0) <= 0 && <p className="text-sm text-red-500"> Please enter valid amount</p>}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Selection of placement</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                {isEditing ? (
                  <Input
                    type="Number"
                    value={application.SelectionOfPlacementCost?.toString()}
                    onChange={(e) => {
                      const tabletCost = Number(application.TabletCost) || 0;
                      const purchaseCost = Number(application.PurchaseOfPlacementCost) || 0;
                      const SelectionOfPlacementCost = Number(e.target.value) || 0;
                      const amountReceived = Number(application.Amount_Received) || 0;
                      const outAmt = tabletCost + purchaseCost + SelectionOfPlacementCost - amountReceived;
                      const totalcost = tabletCost + purchaseCost + SelectionOfPlacementCost;
                      setApplication({ ...application, SelectionOfPlacementCost: parseFloat(e.target.value), Outstanding_Amount: outAmt, TotalCostOfPurchase: totalcost });
                    }}
                  />
                ) : (
                  <span>{application.SelectionOfPlacementCost?.toString()}</span>
                )}
              </td>
            </tr>
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Total cost of purchase</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                <span>{application.TotalCostOfPurchase?.toString()}</span>
              </td>
            </tr>
            {application.Application_Type == "TIP" && (
              <>
                <tr className="border border-gray-300">
                  <td colSpan={1} className="border border-gray-300 p-1">
                    <strong>Number of Months*</strong>
                  </td>
                  <td colSpan={1} className="p-1 w-64">
                    {isEditing ? (
                      <Input
                        type="Number"
                        min="0"
                        step="1"
                        value={application.Number_of_Months?.toString()}
                        onChange={(e) => {
                          setApplication({ ...application, Number_of_Months: parseFloat(e.target.value) });
                        }}
                      />
                    ) : (
                      <span>{application.Number_of_Months?.toString()}</span>
                    )}
                    {checkFields && (application.Number_of_Months?.valueOf() ?? 0) <= 0 && <p className="text-sm text-red-500"> Please enter valid amount</p>}
                  </td>
                </tr>
              </>
            )}
            <tr className="border border-gray-300">
              <td colSpan={1} className="border border-gray-300 p-1">
                <strong>Outstanding Amount</strong>
              </td>
              <td colSpan={1} className="p-1 w-64">
                <span>{application.Outstanding_Amount?.toString()}</span>
                {checkFields && (application.Outstanding_Amount?.valueOf() ?? 0) < 0 && <p className="text-sm text-red-500">Not a vaild amount</p>}
                {checkFields && (application.Outstanding_Amount?.valueOf() ?? 0) > 0 && application.Application_Type != "TIP" && <p className="text-sm text-red-500">Not a vaild amount</p>}
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
                      const tabletCost = Number(application.TabletCost) || 0;
                      const purchaseCost = Number(application.PurchaseOfPlacementCost) || 0;
                      const SelectionOfPlacementCost = Number(application.SelectionOfPlacementCost) || 0;
                      const amountReceived = Number(e.target.value) || 0;
                      const outAmt = tabletCost + purchaseCost + SelectionOfPlacementCost - amountReceived;
                      setApplication({ ...application, Amount_Received: parseFloat(e.target.value), Outstanding_Amount: outAmt });
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
                  <Input
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

export interface TabletApplication {
  ApplicationID: String,
  Tablet_Number: String,
  Leasing_Date: Date,
  Application_Type: String,
  Beneficiary1_Name_English: String,
  Beneficiary1_Name_Chinese: String,
  Beneficiary2_Name_English?: String,
  Beneficiary2_Name_Chinese?: String,
  Beneficiary3_Name_English?: String,
  Beneficiary3_Name_Chinese?: String,
  Applicant_Name_English: String,
  Applicant_Name_Chinese: String,
  Applicant_Gender: String,
  Applicant_Address: String,
  Applicant_IdentifiedCode: String,
  Applicant_Relationship: String,
  Applicant_ContactNumber: String,
  SecondContact_Name_English?: String,
  SecondContact_Name_Chinese?: String,
  SecondContact_Address?: String,
  SecondContact_ContactNumber?: String,
  Officer_In_Charge: String,
  Amount_Received: Number;
  Receipt_No?: String,
  Payment_Comments?: String,
  Remarks?: String,
  Status: String
}

export interface Tablet {
  Tablet_Number: String,
  Block: String,
  Row_Number: String,
  Column_Number: String,
  Status: String,
  ApplicationID?: String,
}

export interface Invoice {
  InvoiceNo: String,
  ApplicationID: String,
  Dated: String,
  Terms: String,
  Tablet_Number: String,
  Payee_Name: String,
  Payee_Address: String,
  Description: "Purchase of Tablet Leasing (Normal)" | "Annual Fee for Maintenance of Ancestor Tablet" | "Purchase of Tablet (Special)" | "Monthly Installment",
  Fiscal_Year: Number,
  Receipt_No: String,
  Amount: Number,
  Year_Positioned: Number,
  IsPaid: Boolean,
}




export interface Task {
  id: String,
  title: String,
  status: String,
  label: String,
  priority: String,
}

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




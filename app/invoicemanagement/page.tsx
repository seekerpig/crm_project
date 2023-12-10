import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { Invoice } from "../data/dataTypes"
import { db } from "@/lib/firebase/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

async function getInvoices() {
  const q = query(collection(db, "invoices"))

  const querySnapshot = await getDocs(q);

  var invoices: Invoice[] = [];

  querySnapshot.forEach((doc) => {
    invoices.push(doc.data() as Invoice);
  });
  console.log("data fetched for invoices");
  return invoices;
}


export default async function InvoiceManagement() {
  const invoices = await getInvoices();
  return (
    <>
      <div className="h-full flex-col space-y-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Invoice Management</h2>
            <p className="text-muted-foreground">
              Manage all your invoices.
            </p>
          </div>
        </div>
        <DataTable data={invoices} columns={columns} />
      </div>
    </>
  )
}

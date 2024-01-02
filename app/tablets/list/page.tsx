import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { TabletApplication } from "../../data/dataTypes";
import { db } from "@/lib/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import ProtectedPage from "@/components/ProtectedPage";

async function getApplications() {
  const q = query(collection(db, "tabletapplications"));

  const querySnapshot = await getDocs(q);

  var tabletApplications: TabletApplication[] = [];

  querySnapshot.forEach((doc) => {
    tabletApplications.push(doc.data() as TabletApplication);
  });
  //console.log(tabletApplications);
  return tabletApplications;
}

export default async function TabletsListView() {
  const applications = await getApplications();

  return (
    <>
      <ProtectedPage />
      <div className="h-full flex-col space-y-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tablet Applications</h2>
            <p className="text-muted-foreground">Here&apos;s a list of the tablet applications.</p>
          </div>
        </div>
        <DataTable data={applications} columns={columns} />
      </div>
    </>
  );
}

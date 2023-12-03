import { promises as fs } from "fs"
import path from "path"
import { Metadata } from "next"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { TabletApplication } from "../../data/dataTypes"

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
async function getApplications() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/tablets/list/data/mockTabletApplications.json")
  )

  const tabletApplications: TabletApplication[] = JSON.parse(data.toString());
  return tabletApplications;
}


export default async function TabletsListView() {
  const applications = await getApplications();

  return (
    <>
      <div className="h-full flex-col space-y-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <DataTable data={applications} columns={columns} />
      </div>
    </>
  )
}

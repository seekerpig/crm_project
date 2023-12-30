import Tablet from "@/components/Tablet";
import { Tablet as TabletType } from "@/app/data/dataTypes";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

async function getTablets() {
  // Reference to the specific document by ID
  let tablets: Tablet[] = [];
  const documentRef = doc(db, "tablets", "BlockE");

  // Retrieve the document
  const documentSnapshot = await getDoc(documentRef);

  if (documentSnapshot.exists()) {
    // Document found
    const data = documentSnapshot.data();
    // console.log('Document ID: BlockA, Data:', data);

    tablets = convertToTabletInterface(data);
    return tablets;
  } else {
    // Document not found
    console.log("Document ID: BlockA not found");
  }
}

function convertToTabletInterface(data: any): Tablet[] {
  return Object.entries(data as Record<string, [string, string | null]>).map(([tabletNumber, [status, appId]]) => {
    const block = tabletNumber.charAt(0);
    const rowNumber = tabletNumber.slice(1, 3);
    const columnNumber = tabletNumber.slice(3);

    return {
      Tablet_Number: tabletNumber,
      Block: block,
      Row_Number: rowNumber,
      Column_Number: columnNumber,
      Status: status,
      AppID: appId || "", // Assuming AppID might be null in some cases
    };
  });
}

export default async function TabletsMapViewBlockA() {
  let tablets = await getTablets().then((tablets) => {
    return (tablets as Tablet[]).sort((a, b) => {
      // Sort by Row_Number in descending order
      const rowComparison = parseInt(b.Row_Number.toString()) - parseInt(a.Row_Number.toString());

      // If Row_Numbers are equal, sort by Column_Number in ascending order
      const columnComparison = parseInt(a.Column_Number.toString()) - parseInt(b.Column_Number.toString());

      return rowComparison || columnComparison;
    });
  });

  return (
    <div className="w-full h-screen overflow-auto">
      <div className="my-1 sticky left-0 top-0 bg-white">
        <span className="bg-white text-black px-2 py-1 rounded-full ms-10 border border-black">Available</span>
        <span className="bg-green-500 text-black px-2 py-1 rounded-full ms-10 ">IPT</span>
        <span className="bg-yellow-500 text-black px-2 py-1 rounded-full ms-10 ">Reserved</span>
        <span className="bg-red-500 text-black px-2 py-1 rounded-full ms-10 ">Occupied</span>
        <span className="bg-purple-500 text-black px-2 py-1 rounded-full ms-10 ">Blocked</span>
      </div>
      <div className="flex flex-col w-max">
        {(() => {
          let blkRowNumber: string;
          let currentRow: string | null = null;
          const rows: JSX.Element[] = [];
          let rowItems: JSX.Element[] = []; // Initialize as an empty array
          tablets.forEach((tablet, index) => {
            blkRowNumber = tablet.Block + " " + tablet.Row_Number;
            if (currentRow === null || parseInt(tablet.Row_Number.toString()) !== parseInt(currentRow)) {
              if (rowItems.length > 0) {
                rows.push(
                  <div key={currentRow} className="flex flex-row ">
                    {rowItems}
                  </div>
                );
                rowItems = [];
              }
              rowItems.push(
                <h1 key={blkRowNumber} className="sticky left-0 pt-5 font-bold flex-none w-10 bg-white">
                  {blkRowNumber}
                </h1>
              );
              currentRow = tablet.Row_Number.toString();
            }
            rowItems.push(<Tablet key={tablet.Tablet_Number.toString()} Block={tablet.Block} Row_Number={tablet.Row_Number} Column_Number={tablet.Column_Number} Status={tablet.Status} Tablet_Number={tablet.Tablet_Number} ApplicationID={tablet.ApplicationID} />);
            if (index === tablets.length - 1) {
              rows.push(
                <div key={currentRow} className="flex flex-row">
                  {rowItems}
                </div>
              );
            }
          });
          return rows;
        })()}
      </div>
    </div>
  );
}

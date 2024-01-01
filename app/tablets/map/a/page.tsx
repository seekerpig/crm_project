
import Tablet from "@/components/Tablet";
import { db } from "@/lib/firebase/firebase";
import { table } from "console";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { Tablets } from "lucide-react";
import { Tablet as TabletType } from "@/app/data/dataTypes";

// const data = {
//   F0101: [ 'Available', '' ],
//   F0103: [ 'Available', '' ],
//   F0105: [ 'Available', '' ],
//   F0107: [ 'Available', '' ],
//   F0109: [ 'Available', '' ],
//   F0111: [ 'Available', '' ],
//   F0113: [ 'Available', '' ],
//   F0115: [ 'Available', '' ],
//   F0117: [ 'Available', '' ],
//   F0119: [ 'Available', '' ],
//   F0121: [ 'Available', '' ],
//   F0123: [ 'Available', '' ],
//   F0125: [ 'Available', '' ],
//   F0127: [ 'Available', '' ],
//   F0129: [ 'Available', '' ],
//   F0131: [ 'Available', '' ],
//   F0133: [ 'Available', '' ],
//   F0135: [ 'Available', '' ],
//   F0137: [ 'Available', '' ],
//   F0202: [ 'Available', '' ],
//   F0204: [ 'Available', '' ],
//   F0206: [ 'Available', '' ],
//   F0208: [ 'Available', '' ],
//   F0210: [ 'Available', '' ],
//   F0212: [ 'Available', '' ],
//   F0214: [ 'Available', '' ],
//   F0216: [ 'Available', '' ],
//   F0218: [ 'Available', '' ],
//   F0220: [ 'Available', '' ],
//   F0222: [ 'Available', '' ],
//   F0224: [ 'Available', '' ],
//   F0226: [ 'Available', '' ],
//   F0228: [ 'Available', '' ],
//   F0230: [ 'Available', '' ],
//   F0232: [ 'Available', '' ],
//   F0234: [ 'Available', '' ],
//   F0236: [ 'Available', '' ],
//   F0301: [ 'Available', '' ],
//   F0303: [ 'Available', '' ],
//   F0305: [ 'Available', '' ],
//   F0307: [ 'Available', '' ],
//   F0309: [ 'Available', '' ],
//   F0311: [ 'Available', '' ],
//   F0313: [ 'Available', '' ],
//   F0315: [ 'Available', '' ],
//   F0317: [ 'Available', '' ],
//   F0319: [ 'Available', '' ],
//   F0321: [ 'Available', '' ],
//   F0323: [ 'Available', '' ],
//   F0325: [ 'Available', '' ],
//   F0327: [ 'Available', '' ],
//   F0329: [ 'Available', '' ],
//   F0331: [ 'Available', '' ],
//   F0333: [ 'Available', '' ],
//   F0335: [ 'Available', '' ],
//   F0337: [ 'Available', '' ],
//   F0402: [ 'Available', '' ],
//   F0404: [ 'Available', '' ],
//   F0406: [ 'Available', '' ],
//   F0408: [ 'Available', '' ],
//   F0410: [ 'Available', '' ],
//   F0412: [ 'Available', '' ],
//   F0414: [ 'Available', '' ],
//   F0416: [ 'Available', '' ],
//   F0418: [ 'Available', '' ],
//   F0420: [ 'Available', '' ],
//   F0422: [ 'Available', '' ],
//   F0424: [ 'Available', '' ],
//   F0426: [ 'Available', '' ],
//   F0428: [ 'Available', '' ],
//   F0430: [ 'Available', '' ],
//   F0432: [ 'Available', '' ],
//   F0434: [ 'Available', '' ],
//   F0436: [ 'Available', '' ],
//   F0501: [ 'Available', '' ],
//   F0503: [ 'Available', '' ],
//   F0505: [ 'Available', '' ],
//   F0507: [ 'Available', '' ],
//   F0509: [ 'Available', '' ],
//   F0511: [ 'Available', '' ],
//   F0513: [ 'Available', '' ],
//   F0515: [ 'Available', '' ],
//   F0517: [ 'Available', '' ],
//   F0519: [ 'Available', '' ],
//   F0521: [ 'Available', '' ],
//   F0523: [ 'Available', '' ],
//   F0525: [ 'Available', '' ],
//   F0527: [ 'Available', '' ],
//   F0529: [ 'Available', '' ],
//   F0531: [ 'Available', '' ],
//   F0533: [ 'Available', '' ],
//   F0535: [ 'Available', '' ],
//   F0537: [ 'Available', '' ],
//   F0602: [ 'Available', '' ],
//   F0604: [ 'Available', '' ],
//   F0606: [ 'Available', '' ],
//   F0608: [ 'Available', '' ],
//   F0610: [ 'Available', '' ],
//   F0612: [ 'Available', '' ],
//   F0614: [ 'Available', '' ],
//   F0616: [ 'Available', '' ],
//   F0618: [ 'Available', '' ],
//   F0620: [ 'Available', '' ],
//   F0622: [ 'Available', '' ],
//   F0624: [ 'Available', '' ],
//   F0626: [ 'Available', '' ],
//   F0628: [ 'Available', '' ],
//   F0630: [ 'Available', '' ],
//   F0632: [ 'Available', '' ],
//   F0634: [ 'Available', '' ],
//   F0636: [ 'Available', '' ],
//   F0701: [ 'Available', '' ],
//   F0703: [ 'Available', '' ],
//   F0705: [ 'Available', '' ],
//   F0707: [ 'Available', '' ],
//   F0709: [ 'Available', '' ],
//   F0711: [ 'Available', '' ],
//   F0713: [ 'Available', '' ],
//   F0715: [ 'Available', '' ],
//   F0717: [ 'Available', '' ],
//   F0719: [ 'Available', '' ],
//   F0721: [ 'Available', '' ],
//   F0723: [ 'Available', '' ],
//   F0725: [ 'Available', '' ],
//   F0727: [ 'Available', '' ],
//   F0729: [ 'Available', '' ],
//   F0731: [ 'Available', '' ],
//   F0733: [ 'Available', '' ],
//   F0735: [ 'Available', '' ],
//   F0737: [ 'Available', '' ],
//   F0802: [ 'Available', '' ],
//   F0804: [ 'Available', '' ],
//   F0806: [ 'Available', '' ],
//   F0808: [ 'Available', '' ],
//   F0810: [ 'Available', '' ],
//   F0812: [ 'Available', '' ],
//   F0814: [ 'Available', '' ],
//   F0816: [ 'Available', '' ],
//   F0818: [ 'Available', '' ],
//   F0820: [ 'Available', '' ],
//   F0822: [ 'Available', '' ],
//   F0824: [ 'Available', '' ],
//   F0826: [ 'Available', '' ],
//   F0828: [ 'Available', '' ],
//   F0830: [ 'Available', '' ],
//   F0832: [ 'Available', '' ],
//   F0834: [ 'Available', '' ],
//   F0836: [ 'Available', '' ],
//   F0901: [ 'Available', '' ],
//   F0903: [ 'Available', '' ],
//   F0905: [ 'Available', '' ],
//   F0907: [ 'Available', '' ],
//   F0909: [ 'Available', '' ],
//   F0911: [ 'Available', '' ],
//   F0913: [ 'Available', '' ],
//   F0915: [ 'Available', '' ],
//   F0917: [ 'Available', '' ],
//   F0919: [ 'Available', '' ],
//   F0921: [ 'Available', '' ],
//   F0923: [ 'Available', '' ],
//   F0925: [ 'Available', '' ],
//   F0927: [ 'Available', '' ],
//   F0929: [ 'Available', '' ],
//   F0931: [ 'Available', '' ],
//   F0933: [ 'Available', '' ],
//   F0935: [ 'Available', '' ],
//   F0937: [ 'Available', '' ],
//   F1002: [ 'Available', '' ],
//   F1004: [ 'Available', '' ],
//   F1006: [ 'Available', '' ],
//   F1008: [ 'Available', '' ],
//   F1010: [ 'Available', '' ],
//   F1012: [ 'Available', '' ],
//   F1014: [ 'Available', '' ],
//   F1016: [ 'Available', '' ],
//   F1018: [ 'Available', '' ],
//   F1020: [ 'Available', '' ],
//   F1022: [ 'Available', '' ],
//   F1024: [ 'Available', '' ],
//   F1026: [ 'Available', '' ],
//   F1028: [ 'Available', '' ],
//   F1030: [ 'Available', '' ],
//   F1032: [ 'Available', '' ],
//   F1034: [ 'Available', '' ],
//   F1036: [ 'Available', '' ],
//   F1101: [ 'Available', '' ],
//   F1103: [ 'Available', '' ],
//   F1105: [ 'Available', '' ],
//   F1107: [ 'Available', '' ],
//   F1109: [ 'Available', '' ],
//   F1111: [ 'Available', '' ],
//   F1113: [ 'Available', '' ],
//   F1115: [ 'Available', '' ],
//   F1117: [ 'Available', '' ],
//   F1119: [ 'Available', '' ],
//   F1121: [ 'Available', '' ],
//   F1123: [ 'Available', '' ],
//   F1125: [ 'Available', '' ],
//   F1127: [ 'Available', '' ],
//   F1129: [ 'Available', '' ],
//   F1131: [ 'Available', '' ],
//   F1133: [ 'Available', '' ],
//   F1135: [ 'Available', '' ],
//   F1137: [ 'Available', '' ],
//   F1202: [ 'Available', '' ],
//   F1204: [ 'Available', '' ],
//   F1206: [ 'Available', '' ],
//   F1208: [ 'Available', '' ],
//   F1210: [ 'Available', '' ],
//   F1212: [ 'Available', '' ],
//   F1214: [ 'Available', '' ],
//   F1216: [ 'Available', '' ],
//   F1218: [ 'Available', '' ],
//   F1220: [ 'Available', '' ],
//   F1222: [ 'Available', '' ],
//   F1224: [ 'Available', '' ],
//   F1226: [ 'Available', '' ],
//   F1228: [ 'Available', '' ],
//   F1230: [ 'Available', '' ],
//   F1232: [ 'Available', '' ],
//   F1234: [ 'Available', '' ],
//   F1236: [ 'Available', '' ],
//   F1301: [ 'Available', '' ],
//   F1303: [ 'Available', '' ],
//   F1305: [ 'Available', '' ],
//   F1307: [ 'Available', '' ],
//   F1309: [ 'Available', '' ],
//   F1311: [ 'Available', '' ],
//   F1313: [ 'Available', '' ],
//   F1315: [ 'Available', '' ],
//   F1317: [ 'Available', '' ],
//   F1319: [ 'Available', '' ],
//   F1321: [ 'Available', '' ],
//   F1323: [ 'Available', '' ],
//   F1325: [ 'Available', '' ],
//   F1327: [ 'Available', '' ],
//   F1329: [ 'Available', '' ],
//   F1331: [ 'Available', '' ],
//   F1333: [ 'Available', '' ],
//   F1335: [ 'Available', '' ],
//   F1337: [ 'Available', '' ],
//   F1402: [ 'Available', '' ],
//   F1404: [ 'Available', '' ],
//   F1406: [ 'Available', '' ],
//   F1408: [ 'Available', '' ],
//   F1410: [ 'Available', '' ],
//   F1412: [ 'Available', '' ],
//   F1414: [ 'Available', '' ],
//   F1416: [ 'Available', '' ],
//   F1418: [ 'Available', '' ],
//   F1420: [ 'Available', '' ],
//   F1422: [ 'Available', '' ],
//   F1424: [ 'Available', '' ],
//   F1426: [ 'Available', '' ],
//   F1428: [ 'Available', '' ],
//   F1430: [ 'Available', '' ],
//   F1432: [ 'Available', '' ],
//   F1434: [ 'Available', '' ],
//   F1436: [ 'Available', '' ],
//   F1501: [ 'Available', '' ],
//   F1503: [ 'Available', '' ],
//   F1505: [ 'Available', '' ],
//   F1507: [ 'Available', '' ],
//   F1509: [ 'Available', '' ],
//   F1511: [ 'Available', '' ],
//   F1513: [ 'Available', '' ],
//   F1515: [ 'Available', '' ],
//   F1517: [ 'Available', '' ],
//   F1519: [ 'Available', '' ],
//   F1521: [ 'Available', '' ],
//   F1523: [ 'Available', '' ],
//   F1525: [ 'Available', '' ],
//   F1527: [ 'Available', '' ],
//   F1529: [ 'Available', '' ],
//   F1531: [ 'Available', '' ],
//   F1533: [ 'Available', '' ],
//   F1535: [ 'Available', '' ],
//   F1537: [ 'Available', '' ],
//   F1602: [ 'Available', '' ],
//   F1604: [ 'Available', '' ],
//   F1606: [ 'Available', '' ],
//   F1608: [ 'Available', '' ],
//   F1610: [ 'Available', '' ],
//   F1612: [ 'Available', '' ],
//   F1614: [ 'Available', '' ],
//   F1616: [ 'Available', '' ],
//   F1618: [ 'Available', '' ],
//   F1620: [ 'Available', '' ],
//   F1622: [ 'Available', '' ],
//   F1624: [ 'Available', '' ],
//   F1626: [ 'Available', '' ],
//   F1628: [ 'Available', '' ],
//   F1630: [ 'Available', '' ],
//   F1632: [ 'Available', '' ],
//   F1634: [ 'Available', '' ],
//   F1636: [ 'Available', '' ],
//   F1701: [ 'Available', '' ],
//   F1703: [ 'Available', '' ],
//   F1705: [ 'Available', '' ],
//   F1707: [ 'Available', '' ],
//   F1709: [ 'Available', '' ],
//   F1711: [ 'Available', '' ],
//   F1713: [ 'Available', '' ],
//   F1715: [ 'Available', '' ],
//   F1717: [ 'Available', '' ],
//   F1719: [ 'Available', '' ],
//   F1721: [ 'Available', '' ],
//   F1723: [ 'Available', '' ],
//   F1725: [ 'Available', '' ],
//   F1727: [ 'Available', '' ],
//   F1729: [ 'Available', '' ],
//   F1731: [ 'Available', '' ],
//   F1733: [ 'Available', '' ],
//   F1735: [ 'Available', '' ],
//   F1737: [ 'Available', '' ]
// }

// async function pushDataToFirebase() {
//   // Push the data to Firestore with specified document IDs
//     try {
//       // Assuming 'applications' is the collection name;
//       const tabletDocRef = doc(db, "tablets", "BlockF");
//       await setDoc(tabletDocRef, data);
//       console.log(`Document with ID BlockA written successfully.`);
//     } catch (error) {
//       console.error("Error adding document: ", error);
//     }
// }

async function getTablets() {
  // create a query against the collection tablets where block = "A" in firestore
  // Reference to the specific document by ID
  let tablets: Tablet[] = [];
  const documentRef = doc(db, "tablets", "BlockA");

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
    <div className="w-full h-screen overflow-auto ">
      <div className="my-1 sticky left-0 top-0 bg-white/75">
        <span className="bg-white text-black px-2 py-1 rounded-full ms-10 border border-black">Available</span>
        <span className="bg-green-300 font-bold text-black px-2 py-1 rounded-full ms-10 ">IPT</span>
        <span className="bg-yellow-200 font-bold text-black px-2 py-1 rounded-full ms-10 ">Reserved</span>
        <span className="bg-red-300 font-bold text-black px-2 py-1 rounded-full ms-10 ">Occupied</span>
        <span className="bg-purple-300 font-bold text-black px-2 py-1 rounded-full ms-10 ">Blocked</span>
      </div>
      {/* <button onClick={() => pushDataToFirebase()}>Push Data to Firebase</button> */}
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
                <h1 key={blkRowNumber} className="sticky left-0 pt-5 font-bold flex-none w-10 bg-white/75">
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

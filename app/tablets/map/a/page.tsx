import Tablet from "@/components/Tablet";
import { db } from "@/lib/firebase/firebase";
import { table } from "console";
import { collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { Tablets } from "lucide-react";
import {Tablet as TabletType} from '@/app/data/dataTypes';


// const data = {
//   E0101: [ 'Available', null ],
//   E0103: [ 'Available', null ],
//   E0105: [ 'Available', null ],
//   E0107: [ 'Available', null ],
//   E0109: [ 'Available', null ],
//   E0111: [ 'Available', null ],
//   E0113: [ 'Available', null ],
//   E0115: [ 'Available', null ],
//   E0117: [ 'Available', null ],
//   E0119: [ 'Available', null ],
//   E0121: [ 'Available', null ],
//   E0123: [ 'Available', null ],
//   E0125: [ 'Available', null ],
//   E0127: [ 'Available', null ],
//   E0129: [ 'Available', null ],
//   E0131: [ 'Available', null ],
//   E0133: [ 'Available', null ],
//   E0135: [ 'Available', null ],
//   E0137: [ 'Available', null ],
//   E0202: [ 'Available', null ],
//   E0204: [ 'Available', null ],
//   E0206: [ 'Available', null ],
//   E0208: [ 'Available', null ],
//   E0210: [ 'Available', null ],
//   E0212: [ 'Available', null ],
//   E0214: [ 'Available', null ],
//   E0216: [ 'Available', null ],
//   E0218: [ 'Available', null ],
//   E0220: [ 'Available', null ],
//   E0222: [ 'Available', null ],
//   E0224: [ 'Available', null ],
//   E0226: [ 'Available', null ],
//   E0228: [ 'Available', null ],
//   E0230: [ 'Available', null ],
//   E0232: [ 'Available', null ],
//   E0234: [ 'Available', null ],
//   E0236: [ 'Available', null ],
//   E0301: [ 'Available', null ],
//   E0303: [ 'Available', null ],
//   E0305: [ 'Available', null ],
//   E0307: [ 'Available', null ],
//   E0309: [ 'Available', null ],
//   E0311: [ 'Available', null ],
//   E0313: [ 'Available', null ],
//   E0315: [ 'Available', null ],
//   E0317: [ 'Available', null ],
//   E0319: [ 'Available', null ],
//   E0321: [ 'Available', null ],
//   E0323: [ 'Available', null ],
//   E0325: [ 'Available', null ],
//   E0327: [ 'Available', null ],
//   E0329: [ 'Available', null ],
//   E0331: [ 'Available', null ],
//   E0333: [ 'Available', null ],
//   E0335: [ 'Available', null ],
//   E0337: [ 'Available', null ],
//   E0402: [ 'Available', null ],
//   E0404: [ 'Available', null ],
//   E0406: [ 'Available', null ],
//   E0408: [ 'Available', null ],
//   E0410: [ 'Available', null ],
//   E0412: [ 'Available', null ],
//   E0414: [ 'Available', null ],
//   E0416: [ 'Available', null ],
//   E0418: [ 'Available', null ],
//   E0420: [ 'Available', null ],
//   E0422: [ 'Available', null ],
//   E0424: [ 'Available', null ],
//   E0426: [ 'Available', null ],
//   E0428: [ 'Available', null ],
//   E0430: [ 'Available', null ],
//   E0432: [ 'Available', null ],
//   E0434: [ 'Available', null ],
//   E0436: [ 'Available', null ],
//   E0501: [ 'Available', null ],
//   E0503: [ 'Available', null ],
//   E0505: [ 'Available', null ],
//   E0507: [ 'Available', null ],
//   E0509: [ 'Available', null ],
//   E0511: [ 'Available', null ],
//   E0513: [ 'Available', null ],
//   E0515: [ 'Available', null ],
//   E0517: [ 'Available', null ],
//   E0519: [ 'Available', null ],
//   E0521: [ 'Available', null ],
//   E0523: [ 'Available', null ],
//   E0525: [ 'Available', null ],
//   E0527: [ 'Available', null ],
//   E0529: [ 'Available', null ],
//   E0531: [ 'Available', null ],
//   E0533: [ 'Available', null ],
//   E0535: [ 'Available', null ],
//   E0537: [ 'Available', null ],
//   E0602: [ 'Available', null ],
//   E0604: [ 'Available', null ],
//   E0606: [ 'Available', null ],
//   E0608: [ 'Available', null ],
//   E0610: [ 'Available', null ],
//   E0612: [ 'Available', null ],
//   E0614: [ 'Available', null ],
//   E0616: [ 'Available', null ],
//   E0618: [ 'Available', null ],
//   E0620: [ 'Available', null ],
//   E0622: [ 'Available', null ],
//   E0624: [ 'Available', null ],
//   E0626: [ 'Available', null ],
//   E0628: [ 'Available', null ],
//   E0630: [ 'Available', null ],
//   E0632: [ 'Available', null ],
//   E0634: [ 'Available', null ],
//   E0636: [ 'Available', null ],
//   E0701: [ 'Available', null ],
//   E0703: [ 'Available', null ],
//   E0705: [ 'Available', null ],
//   E0707: [ 'Available', null ],
//   E0709: [ 'Available', null ],
//   E0711: [ 'Available', null ],
//   E0713: [ 'Available', null ],
//   E0715: [ 'Available', null ],
//   E0717: [ 'Available', null ],
//   E0719: [ 'Available', null ],
//   E0721: [ 'Available', null ],
//   E0723: [ 'Available', null ],
//   E0725: [ 'Available', null ],
//   E0727: [ 'Available', null ],
//   E0729: [ 'Available', null ],
//   E0731: [ 'Available', null ],
//   E0733: [ 'Available', null ],
//   E0735: [ 'Available', null ],
//   E0737: [ 'Available', null ],
//   E0802: [ 'Available', null ],
//   E0804: [ 'Available', null ],
//   E0806: [ 'Available', null ],
//   E0808: [ 'Available', null ],
//   E0810: [ 'Available', null ],
//   E0812: [ 'Available', null ],
//   E0814: [ 'Available', null ],
//   E0816: [ 'Available', null ],
//   E0818: [ 'Available', null ],
//   E0820: [ 'Available', null ],
//   E0822: [ 'Available', null ],
//   E0824: [ 'Available', null ],
//   E0826: [ 'Available', null ],
//   E0828: [ 'Available', null ],
//   E0830: [ 'Available', null ],
//   E0832: [ 'Available', null ],
//   E0834: [ 'Available', null ],
//   E0836: [ 'Available', null ],
//   E0901: [ 'Available', null ],
//   E0903: [ 'Available', null ],
//   E0905: [ 'Available', null ],
//   E0907: [ 'Available', null ],
//   E0909: [ 'Available', null ],
//   E0911: [ 'Available', null ],
//   E0913: [ 'Available', null ],
//   E0915: [ 'Available', null ],
//   E0917: [ 'Available', null ],
//   E0919: [ 'Available', null ],
//   E0921: [ 'Available', null ],
//   E0923: [ 'Available', null ],
//   E0925: [ 'Available', null ],
//   E0927: [ 'Available', null ],
//   E0929: [ 'Available', null ],
//   E0931: [ 'Available', null ],
//   E0933: [ 'Available', null ],
//   E0935: [ 'Available', null ],
//   E0937: [ 'Available', null ],
//   E1002: [ 'Available', null ],
//   E1004: [ 'Available', null ],
//   E1006: [ 'Available', null ],
//   E1008: [ 'Available', null ],
//   E1010: [ 'Available', null ],
//   E1012: [ 'Available', null ],
//   E1014: [ 'Available', null ],
//   E1016: [ 'Available', null ],
//   E1018: [ 'Available', null ],
//   E1020: [ 'Available', null ],
//   E1022: [ 'Available', null ],
//   E1024: [ 'Available', null ],
//   E1026: [ 'Available', null ],
//   E1028: [ 'Available', null ],
//   E1030: [ 'Available', null ],
//   E1032: [ 'Available', null ],
//   E1034: [ 'Available', null ],
//   E1036: [ 'Available', null ],
//   E1101: [ 'Available', null ],
//   E1103: [ 'Available', null ],
//   E1105: [ 'Available', null ],
//   E1107: [ 'Available', null ],
//   E1109: [ 'Available', null ],
//   E1111: [ 'Available', null ],
//   E1113: [ 'Available', null ],
//   E1115: [ 'Available', null ],
//   E1117: [ 'Available', null ],
//   E1119: [ 'Available', null ],
//   E1121: [ 'Available', null ],
//   E1123: [ 'Available', null ],
//   E1125: [ 'Available', null ],
//   E1127: [ 'Available', null ],
//   E1129: [ 'Available', null ],
//   E1131: [ 'Available', null ],
//   E1133: [ 'Available', null ],
//   E1135: [ 'Available', null ],
//   E1137: [ 'Available', null ],
//   E1202: [ 'Available', null ],
//   E1204: [ 'Available', null ],
//   E1206: [ 'Available', null ],
//   E1208: [ 'Available', null ],
//   E1210: [ 'Available', null ],
//   E1212: [ 'Available', null ],
//   E1214: [ 'Available', null ],
//   E1216: [ 'Available', null ],
//   E1218: [ 'Available', null ],
//   E1220: [ 'Available', null ],
//   E1222: [ 'Available', null ],
//   E1224: [ 'Available', null ],
//   E1226: [ 'Available', null ],
//   E1228: [ 'Available', null ],
//   E1230: [ 'Available', null ],
//   E1232: [ 'Available', null ],
//   E1234: [ 'Available', null ],
//   E1236: [ 'Available', null ],
//   E1301: [ 'Available', null ],
//   E1303: [ 'Available', null ],
//   E1305: [ 'Available', null ],
//   E1307: [ 'Available', null ],
//   E1309: [ 'Available', null ],
//   E1311: [ 'Available', null ],
//   E1313: [ 'Available', null ],
//   E1315: [ 'Available', null ],
//   E1317: [ 'Available', null ],
//   E1319: [ 'Available', null ],
//   E1321: [ 'Available', null ],
//   E1323: [ 'Available', null ],
//   E1325: [ 'Available', null ],
//   E1327: [ 'Available', null ],
//   E1329: [ 'Available', null ],
//   E1331: [ 'Available', null ],
//   E1333: [ 'Available', null ],
//   E1335: [ 'Available', null ],
//   E1337: [ 'Available', null ],
//   E1402: [ 'Available', null ],
//   E1404: [ 'Available', null ],
//   E1406: [ 'Available', null ],
//   E1408: [ 'Available', null ],
//   E1410: [ 'Available', null ],
//   E1412: [ 'Available', null ],
//   E1414: [ 'Available', null ],
//   E1416: [ 'Available', null ],
//   E1418: [ 'Available', null ],
//   E1420: [ 'Available', null ],
//   E1422: [ 'Available', null ],
//   E1424: [ 'Available', null ],
//   E1426: [ 'Available', null ],
//   E1428: [ 'Available', null ],
//   E1430: [ 'Available', null ],
//   E1432: [ 'Available', null ],
//   E1434: [ 'Available', null ],
//   E1436: [ 'Available', null ],
//   E1501: [ 'Available', null ],
//   E1503: [ 'Available', null ],
//   E1505: [ 'Available', null ],
//   E1507: [ 'Available', null ],
//   E1509: [ 'Available', null ],
//   E1511: [ 'Available', null ],
//   E1513: [ 'Available', null ],
//   E1515: [ 'Available', null ],
//   E1517: [ 'Available', null ],
//   E1519: [ 'Available', null ],
//   E1521: [ 'Available', null ],
//   E1523: [ 'Available', null ],
//   E1525: [ 'Available', null ],
//   E1527: [ 'Available', null ],
//   E1529: [ 'Available', null ],
//   E1531: [ 'Available', null ],
//   E1533: [ 'Available', null ],
//   E1535: [ 'Available', null ],
//   E1537: [ 'Available', null ],
//   E1602: [ 'Available', null ],
//   E1604: [ 'Available', null ],
//   E1606: [ 'Available', null ],
//   E1608: [ 'Available', null ],
//   E1610: [ 'Available', null ],
//   E1612: [ 'Available', null ],
//   E1614: [ 'Available', null ],
//   E1616: [ 'Available', null ],
//   E1618: [ 'Available', null ],
//   E1620: [ 'Available', null ],
//   E1622: [ 'Available', null ],
//   E1624: [ 'Available', null ],
//   E1626: [ 'Available', null ],
//   E1628: [ 'Available', null ],
//   E1630: [ 'Available', null ],
//   E1632: [ 'Available', null ],
//   E1634: [ 'Available', null ],
//   E1636: [ 'Available', null ],
//   E1701: [ 'Available', null ],
//   E1703: [ 'Available', null ],
//   E1705: [ 'Available', null ],
//   E1707: [ 'Available', null ],
//   E1709: [ 'Available', null ],
//   E1711: [ 'Available', null ],
//   E1713: [ 'Available', null ],
//   E1715: [ 'Available', null ],
//   E1717: [ 'Available', null ],
//   E1719: [ 'Available', null ],
//   E1721: [ 'Available', null ],
//   E1723: [ 'Available', null ],
//   E1725: [ 'Available', null ],
//   E1727: [ 'Available', null ],
//   E1729: [ 'Available', null ],
//   E1731: [ 'Available', null ],
//   E1733: [ 'Available', null ],
//   E1735: [ 'Available', null ],
//   E1737: [ 'Available', null ]
// }


// async function pushDataToFirebase() {
//   // Push the data to Firestore with specified document IDs
//     try {
//       // Assuming 'applications' is the collection name;
//       const tabletDocRef = doc(db, "tablets", "BlockE");
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
const documentRef = doc(db, 'tablets', 'BlockA');

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
  console.log('Document ID: BlockA not found');
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
      AppID: appId || '', // Assuming AppID might be null in some cases
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
                <h1 key={blkRowNumber} className="sticky left-0 pt-5 font-bold flex-none w-10 bg-white">
                  {blkRowNumber}
                </h1>
              );
              currentRow = tablet.Row_Number.toString();
            }
            rowItems.push(<Tablet key={tablet.Tablet_Number.toString()} Block={tablet.Block} Row_Number={tablet.Row_Number} Column_Number={tablet.Column_Number} Status={tablet.Status} Tablet_Number={tablet.Tablet_Number} ApplicationID={tablet.ApplicationID}/>);
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

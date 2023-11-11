import TestLayout from "../../../layouts/testLayout";
import Tablet from "@/app/components/Tablet";
import { TabletProps } from "@/app/components/Tablet";

export interface BlockData {
  rows: BlockRow[];
}

export interface BlockRow {
  tablets: TabletProps[];
}


export default function TabletsMapViewBlockA() {
  
let blockData: BlockData = {
  rows: [
    {
      tablets: [
        {
          block: "A",
          row: 1,
          number: 1
        },
        {
          block: "A",
          row: 2,
          number: 2
        }
      ]
    }
  ]
};

  return (
    <TestLayout>
      <div className="flex flex-column">
        {blockData.rows[0].tablets.map((tablet) => 
          {
            return <Tablet 
            key={tablet.number.toString()}
            block = {tablet.block}
            row = {tablet.row}
            number = {tablet.number}
            />
          }
        )}
        
      </div>
    </TestLayout>
  );
}

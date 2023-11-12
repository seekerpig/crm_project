import Tablet from "@/components/Tablet";
import { TabletProps } from "@/components/Tablet";

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
            number: 1,
          },
          {
            block: "A",
            row: 2,
            number: 2,
          },
        ],
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="flex flex-column">
        {blockData.rows[0].tablets.map((tablet) => {
          return <Tablet key={tablet.number.toString()} block={tablet.block} row={tablet.row} number={tablet.number} />;
        })}
      </div>
    </div>
  );
}

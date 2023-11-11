export interface TabletProps {
  block: String;
  row: Number;
  number: Number;
}

function Tablet(props: TabletProps) {
  return (
    <div>
      <div className="w-[43px] h-[51px] px-3 pt-[25px] pb-1 bg-white rounded shadow border border-zinc-700 flex-col justify-end items-center inline-flex">
        <div>
          {props.number.toString()}
        </div>
      </div>
    </div>
  );
}

export default Tablet;

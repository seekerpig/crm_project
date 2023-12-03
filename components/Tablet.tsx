export interface TabletProps {
  block: string;
  row: number;
  number: number;
  status: string;
}

function Tablet(props: TabletProps) {
  const { number, status } = props;

  let statusColorClass = '';

  switch (status) {
    case 'ipt in progress':
      statusColorClass = 'bg-green-500'; // Green
      break;
    case 'reserved':
      statusColorClass = 'bg-yellow-500'; // Yellow
      break;
    case 'occupied':
      statusColorClass = 'bg-red-500'; // Red
      break;
    case 'blocked':
      statusColorClass = 'bg-purple-500'; // Purple
      break;
    default:
      statusColorClass = ''; // Default color
  }

  return (
    <div className={Number(number) == 2? `ml-7 ` : ``}>
      <div className={ `${statusColorClass} w-[43px] h-[51px] px-3 pt-[25px] pb-1 bg-white rounded shadow border border-zinc-700 flex-col justify-end items-center inline-flex m-2`}>
        <div >
          {number.toString()}
        </div>
      </div>
    </div>
  );
}

export default Tablet;

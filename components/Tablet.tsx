export interface TabletProps {
  block: string;
  row: number;
  number: number;
  status: string;
}

function Tablet(props: TabletProps) {
  const { number, status, block } = props;

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
    <div className={Number(number) === 2 && block!=="D" ? 'ml-7 ' : Number(number) === 1 && block==="D" ? 'ml-7' : ' '}>
      <div className={`${statusColorClass} ${status === 'Not Available' ? 'w-[43px] h-[51px] px-3 pt-[25px] m-1' : 'w-[43px] h-[51px] px-3 pt-[25px] pb-1 border border-zinc-700 bg-white rounded shadow flex-col justify-end items-center inline-flex m-1'}`}>
      {status !== 'Not Available' && (
        <div>
          {number.toString()}
        </div>
      )}
      </div>
    </div>
  );
}

export default Tablet;

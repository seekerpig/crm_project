import {Tablet} from '@/app/data/dataTypes';


function Tablet(props: Tablet) {

  let statusColorClass = '';

  switch (props.Status.toString()) {
    case 'IPT':
      statusColorClass = 'bg-green-500'; // Green
      break;
    case 'Reserved':
      statusColorClass = 'bg-yellow-500'; // Yellow
      break;
    case 'Occupied':
      statusColorClass = 'bg-red-500'; // Red
      break;
    case 'Blocked':
      statusColorClass = 'bg-purple-500'; // Purple
      break;
    default:
      statusColorClass = ''; // Default color
  }

  return (
    <div className={Number(props.Column_Number) === 2 && props.Block!=="D" ? 'ml-7 ' : Number(props.Column_Number) === 1 && props.Block==="D" ? 'ml-7' : ' '}>
      <div className={` ${props.Status === 'Not Available' ? 'w-[43px] h-[51px] px-3 pt-[25px] m-1' : `${statusColorClass} w-[43px] h-[51px] px-3 pt-[25px] pb-1 border border-zinc-700 rounded shadow flex-col justify-end items-center inline-flex m-1`}`}>
      {props.Status !== 'Not Available' && (
        <div>
          {props.Column_Number}
        </div>
      )}
      </div>
    </div>
  );
}

export default Tablet;

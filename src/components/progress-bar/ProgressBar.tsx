interface Props{
    percentCompleted:string;
}

const ProgressBar = ({percentCompleted}:Props) => {
  return (
    <div className="w-full bg-[#EBE7F7] dark:bg-neutral-600 rounded-md border">
          <div
          className="bg-[#AC94FF] rounded-md p-0.5 text-center text-xs font-medium leading-none text-primary-100"
          style={{ width: percentCompleted }}
          >
          
          </div>
      </div>
  )
}

export default ProgressBar
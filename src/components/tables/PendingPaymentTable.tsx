import React from "react"
import {createColumnHelper,flexRender,getCoreRowModel,useReactTable,} from '@tanstack/react-table'
import { TableDataType } from "../../types/myTypes"
import CircleLoader from "../loaders/CircleLoader";


interface Props{
  tableData:TableDataType[];
  isLoading:boolean;
}

const columnHelper = createColumnHelper<TableDataType>()

const columns = [
  columnHelper.accessor('due__Name', {
    header: 'Particluars',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor('due__startDate', {
    header: 'Date',
    cell: (info) => info.getValue(),
  }),
  
];


const PendingPaymentTable = ({tableData,isLoading}:Props) => {

 
  
  const rerender = React.useReducer(() => ({}), {})[1]

  // const [data, ] = React.useState(() => [...tableData])
  const [data, ] = React.useState<TableDataType[]>(tableData);
 


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading){
    return <CircleLoader />
  }
  if (data){

    return (
        <>
      <div className="p-2 registration-table">
          <table className="table ">
            <thead >
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}
                  
                >
                  {headerGroup.headers.map((header,index) => (
                    <th key={header.id} className={`${index % 2 === 0 ? "bg-primary-dark2" : "bg-primary-light2"} ${index === 0 && "rounded-tl-md rounded-bl-md"}  text-center  text-white relative min-w-[60px] text-sm font-semibold border-b capitalize pt-3 pl-[6px] pr-1 pb-4  max-w-[150px] sm:max-w-[200px] break-words  gap-2`}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                   <th key={headerGroup.id} className={` ${headerGroup.headers.length+1 % 2 === 0 ? "bg-primary-dark2" : "bg-primary-light2"} rounded-tr-md rounded-br-md text-center text-white relative text-sm font-semibold border-b capitalize pt-3 pl-1 pr-1 pb-4  max-w-[150px] sm:max-w-[200px] break-words  gap-2`}>
                      Action
                   </th>
                </tr>
              ))}
            </thead>
            <tbody >
              {table.getRowModel().rows.map((row,index) => (
                <tr key={row.id} className={` ${index % 2 === 0 ? "bg-[#E6E7EA]" : "bg-white"} w-full text-base border-b text-center border-gray-300`}
               
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}   className="text-center text-[14px] font[400] max-w-[150px] sm:max-w-[200px] pt-2 pl-[6px] pr-1 pb-2  break-words" >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                   <td className='hover:cursor' >
                    
                    <button className="text-white bg-org-primary px-3 py-1 rounded-md my-2 min-w-[70px]"  >Pay</button>     
                   </td>
                </tr>
              ))}
            </tbody>
      
          </table>
          <div className="h-4" />
        
              <button onClick={() => rerender()} className="border p-2">
              Rerender
              </button>
          </div>
          
          {/* <h3>sdsd</h3> */}
        
   
  
  
  
  
  
      </>
    )
  }
}

export default PendingPaymentTable
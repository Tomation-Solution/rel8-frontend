import {  useMemo, } from 'react';
import {useTable} from 'react-table'
// import {TableStyle} from './Table.style'
// import MOCK_DATA from './mock.json';
import PropTypes from 'prop-types';
import './Table.css'



const Table = ({ prop_columns=[],custom_data=[]}) =>{
  // const user = getUserOr404()
  // const dispatch = useAppDispatch()
  // const { listings ,status} = useAppSelector(SelectListingForLandmark)
  // const [listings,setListings] = useState([])
  const columns = useMemo(()=>prop_columns,[])
  const data = useMemo(()=>custom_data,[custom_data])

  const  {
    // getTableBodyProps,
    getTableProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,data
  })

  const handleRowRoute = (id)=>{
    console.log(id) 
    //this would send the page to a detail page
  }
  return(
    <div className='p-2 registration-table'>
      {/* <Preloader loading={status==='pending'}/> */}
      <table   {...getTableProps()} 
      className='table'
      >
        <thead >
          {
            headerGroups.map((headerGroup,index)=>(
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {
                  headerGroup.headers.map((column,columnIndex)=>{
                    return (
                      <th {...column.getHeaderProps()} key={columnIndex}
                      className={`${columnIndex % 2 === 0 ? "bg-primary-dark2" : "bg-primary-light2"} ${index === 0 && "rounded-tl-md rounded-bl-md"}  text-center  text-white relative min-w-[60px] text-sm font-semibold border-b capitalize pt-3 pl-[6px] pr-1 pb-4  max-w-[150px] sm:max-w-[200px] break-words  gap-2`}
                      >{column.render('Header')}</th>  
                    )
                  })
                }
              </tr>

            ))
          }
        </thead>

        <tbody {...getTableProps()}>
          {
            rows.map((row,index)=>{
              let id = row.original.id

              prepareRow(row)
              return <tr {...row.getRowProps()} key={index} onClick={(e)=>handleRowRoute(id)}>
                {
                  row.cells.map((cell,cellIndex)=><td {...cell.getCellProps()} key={cellIndex}>{cell.render('Cell')}</td>)
                }
              </tr>
            })
          }                
        </tbody>
      </table>
    </div>
  )
}

Table.propTypes= {
  prop_columns:PropTypes.array,
  custom_data:PropTypes.array,
}


export default Table
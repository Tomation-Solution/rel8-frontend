import { useNavigate, useParams } from "react-router-dom"
import { getAllSubmissionOfAService, getServiceDetail } from "../../../api/serviceRequestApi"
import { useQuery } from "react-query"
import Button from "../../../components/button/Button"
import Table from '../../../components/Table/Table'
import CircleLoader from "../../../components/loaders/CircleLoader"


const ServiceRequestDetail =()=>{

    const {id:service_id} =useParams();
    const navigate = useNavigate()
    const {isLoading,data} = useQuery(['getServiceDetail',service_id],()=>getServiceDetail({service_id:typeof service_id==='string'?service_id:'-1'}),{
        'enabled':typeof service_id==='string'?true:false
    })
    const {isLoading:loadingSubbmission,data:submission } = useQuery(['getAllSubmissionOfAService',service_id],()=>getAllSubmissionOfAService({service_id:typeof service_id==='string'?service_id:'-1'}),{
        'enabled':typeof service_id==='string'?true:false
    })

    const prop_columns =[
        
        
        {
            Header:'Approval Status',
            accessor:'status',
        },
        // {
        //     Header:'Update Subbmission',
        //     accessor:'a',
        //     Cell:(tableProps:any)=>(
        //           <div>


        //             <Button
        //             onClick={e=>{
        //                 e.preventDefault()
        //                 if(tableProps.row.original.status=='pending'){
        //                     // route.push(`/members/services/submission/update/${tableProps.row.original.id}/`)
        //                 }
        //             }}
        //             // style={{'width':'150px'}} 
        //             className="w-[150px]"
        //             text=  {
        //                 tableProps.row.original.status=='pending'?
        //                 'edit request':"You can't edit aprroved request"
        //                }
        //             />
                  
        //           </div>
        //     )
        // },
    ]
    const hasPending = submission?.filter((d)=>d.status == 'pending').length!==0
    return (
        <div>
            { isLoading && <CircleLoader />}



<div style={{'margin':'0 auto','maxWidth':'900px',
                // 'border':'1px solid red'
                }}>
                <div>
                <br /><br />
            <h3>{data?.intro_text}:</h3>
            <ul>
                {
                    data?.fields_subbission.fields?.map((d,index)=>(
                        <li key={index}>Submission of <strong>{d}</strong> </li>
                    ))
                }
                {
                    data?.file_subbission.fields?.map((d,index)=>(
                        <li key={index}>Upload Pdf docs of <strong>{d}</strong> </li>
                    ))
                }
            </ul>
            <br />
            <div style={{'display':'flex','justifyContent':'space-between','alignItems':'center','flexWrap':'wrap','gap':'10px'}}>
            <h2>Previous Applications</h2>
            <Button   
            // style={{'maxWidth':'200px'}}
            // size="" 
            className="w-[280px]"
            onClick={()=>{
                if(hasPending){
                    //
                    navigate(`/service-requests-submission/${service_id}?member_submission_id=${submission?.filter((d)=>d.status == 'pending')[0].id}`)
                }else{

                    navigate(`/service-requests-submission/${service_id}`)
                }
                // route.push(`/members/services/submission/${service_id}/`)
            }} 
                text={`${hasPending?'Update Pending':'Apply for'} ${data?.service_name??""}`}
            />
            </div>
            <br /><br />
            <Table prop_columns={prop_columns} custom_data={submission?submission:[]} />
            </div>
                </div>
        </div>
    )
}


export default ServiceRequestDetail
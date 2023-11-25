interface Props{
  image:string;
  name:string;
  about:string;
}


const ElectionContestantCard = ({image,name,about}:Props) => {
  return (
   <>
    <div className="max-w-sm  border border-gray-200 rounded-lg shadow p-3 bg-primary-dark2 ">
   
   <img className="rounded-t-lg w-full" src={image} alt="" />

<div className="my-2">
   <a href="#">
       <h5 className="mb-1 text-base font-semibold tracking-tight line-clamp-1 text-white">{name}</h5>
   </a>
   <p className="mb-1 font-light  line-clamp-2 text-sm text-white">{about}</p>
  
  <div className="flex flex-col gap-2" >
       <button className='bg-primaryBlue rounded-md text-white py-2 px-3' >Vote</button>           
       <button className='border border-[#67CCFF] rounded-md text-[#67CCFF] py-2 px-3' >View Bio</button>           
  </div>
  
</div>
</div>
   </>
  )
}

export default ElectionContestantCard
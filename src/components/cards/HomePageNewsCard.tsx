import CardButton from "../button/CardButton";

interface Props{
    newsItem:any;
    index:number;
}

const HomePageNewsCard = ({newsItem,index}:Props) => {
  return (
    <div key={newsItem.id} className={`mx-2 relative border border-gray-200 ${index === 0 ? `h-[250px]`: `h-[230px]` } h-[250px] rounded-md col-span-3`}>
    {/* News */}
    {/* {index === 0 && <span className='text-white font-medium text-xs absolute z-[3] bg-primary-blue p-2 rounded-tl-xl' >News</span> } */}
    <span className='text-white font-medium text-xs absolute z-[3] bg-primary-blue p-2 rounded-tl-xl' >News</span>
      <img className="absolute top-0 left-0 bottom-0 right-0 w-full max-w-full h-full object-cover rounded-md" src={newsItem.bannerUrl} alt="" />
      {/* Read More */}
      <div className="absolute bottom-0 w-full flex items-center justify-between rounded-b-xl gap-2 z-[3] px-2 py-1 text-sm text-white bg-black bg-opacity-50">
        <div className="col-span-2 line-clamp-2 text-white text-sm">
        {newsItem.topic}
        </div>
        <CardButton text='Read More' path={`/news/${newsItem._id}`} />
      </div>
    </div>
  )
}

export default HomePageNewsCard
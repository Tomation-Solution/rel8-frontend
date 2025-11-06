interface Props{
    imageUrl:string;
    avatarClass?:string;
    color?:string;
    name?: string;
}
const Avatar = ({imageUrl,color,avatarClass,name}:Props) => {
  return (
    <div className={`${avatarClass ? avatarClass : ` w-[44px] h-[44px]`}  flex items-center justify-center bg-gray-100  ${color ? color : " border-gray-200 border-2"} rounded-full`} >
        { imageUrl? <img className={` w-full h-full rounded-full `} src={imageUrl} alt="profile-image" /> : `${name?.charAt(0).toUpperCase()}` }
    </div>
  )
}

export default Avatar
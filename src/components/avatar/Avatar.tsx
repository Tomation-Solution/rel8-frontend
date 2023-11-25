interface Props{
    imageUrl:string;
    avatarClass?:string;
    color?:string;
}
const Avatar = ({imageUrl,color,avatarClass}:Props) => {
  return (
    <div className={`${avatarClass ? avatarClass : ` w-[44px] h-[44px]`}   ${color ? color : " border-gray-200 border-2"} rounded-full`} >
        <img className={` w-full h-full rounded-full `} src={imageUrl} alt="profile-image" />
    </div>
  )
}

export default Avatar
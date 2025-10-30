import { Link } from 'react-router-dom'
interface Prop{
    showLink?:boolean
}
const RememberUser = ({showLink}:Prop) => {
  return (
    <div className="flex items-center text-textColor justify-between font-[500]  text-[14px]">
    <aside className="flex items-center gap-2 ">
      <input type="checkbox" />
      <p>Remember me</p>
    </aside>
    {showLink && (

    <Link to="/forgot-password" className="text-org-primaryBlue">
      Forgot Password?
    </Link>
    )}
  </div>
  )
}

export default RememberUser
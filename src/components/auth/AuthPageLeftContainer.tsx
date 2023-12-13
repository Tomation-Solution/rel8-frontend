// import BpmiLogo from '../../assets/cover-images/bpmi-logo.jpg'
import { getTenantInfo } from '../../utils/constants';
// bpmi-logo.jpg

interface Props {
  image: string;
  maxHeight?:string;
}
const AuthPageLeftContainer = ({ image,maxHeight }: Props) => {
  const {logo} = getTenantInfo()

  return (
    <section className={`col-span-0 xl:col-span-1 hidden md:inline-block relative ${maxHeight ? maxHeight : "max-h-screen"}`} >


    <img
    className="absolute top-0 left-0 bottom-0 right-0 w-full max-w-full h-full object-cover max-h-[inherit]"
    src={image}
    alt=""  
  />

  <img 
  className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-[150px] h-[150px]'
  src={
    logo
  } alt="" />
    </section>
  );
};

export default AuthPageLeftContainer;

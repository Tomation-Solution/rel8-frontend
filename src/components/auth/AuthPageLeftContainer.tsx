interface Props {
  image: string;
  maxHeight?:string;
}
const AuthPageLeftContainer = ({ image,maxHeight }: Props) => {
  return (
    <section className={`col-span-0 xl:col-span-1 hidden md:inline-block relative ${maxHeight ? maxHeight : "max-h-screen"}`} >


    <img
    className="absolute top-0 left-0 bottom-0 right-0 w-full max-w-full h-full object-cover max-h-[inherit]"
    src={image}
    alt=""
  />
    </section>
  );
};

export default AuthPageLeftContainer;

import AuthPageLeftContainer from "../../../components/auth/AuthPageLeftContainer";
import blueBackgroundImage from "../../../assets/images/blueCoverBackground.png";
import AuthPageHeader from "../../../components/auth/AuthPageHeader";

const EnterCodePage = () => {
  

  return (
    <div className="grid items-center w-full h-screen place text-color">
    <div className="grid w-full h-full grid-cols-2 ">
      <AuthPageLeftContainer image={blueBackgroundImage} />
      <section className="relative grid h-full col-span-2 md:col-span-1 place-items-center">
        
        <div className="auth-form-container">
          <AuthPageHeader
            authPageHeader="Enter code"
            authPageText="Input 4 digit code received to proceed"
          />
          <form className="flex flex-col w-full max-w-md gap-y-4 ">
            <div className="flex items-center justify-center w-full gap-1" >

            <input type="text" className="w-10 h-10 border rounded-sm outline text-neutral2 border-neutral2"  />
            <input type="text" className="w-10 h-10 border rounded-sm text-neutral2 border-neutral2"  />
            <input type="text"  className="w-10 h-10 border rounded-sm text-neutral2 border-neutral2" />
            <input type="text"  className="w-10 h-10 border rounded-sm text-neutral2 border-neutral2" />
            </div> 

            <div className="grid">
              <button className="btn">Continue</button>
            </div>
          </form>
          
        </div>
      </section>
    </div>
  </div>
  )
}

export default EnterCodePage
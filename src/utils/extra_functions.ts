import jwt_decode from "jwt-decode";

type UserRegistrationParticluarsDataType = {
    MEMBERSHIP_NO:string;
    TITLE:string;
    name:string;
    MEMBERSHIP_GRADE:string;
    POSITION_HELD:string|null
}


export const setRel8UserRegistrationData = (data:UserRegistrationParticluarsDataType )=>{
    localStorage.setItem('userRel8RegistrationData',JSON.stringify(data))
  return true
}

export const getRel8UserRegistrationData = () => {
  const data = localStorage.getItem('userRel8RegistrationData');
  if (data) {
    const userData = JSON.parse(data);
    return userData
  } else {
    return null
  }
};

export const getRel8LoginUserToken = () =>{
  try{
      const data = localStorage.getItem('rel8User')
      if (data){
        const token = JSON.parse(data)?.token
        return token
      }
  }catch(err:any){
      return null
  
}
}

export const getRel8LoginUserData = () =>{
  try{
      const data = localStorage.getItem('rel8User')
      if (data){
        const logged_in_user = jwt_decode(JSON.parse(data)?.access )
        return logged_in_user
      }
  }catch(err:any){
      return null
  
}

}
export const setRel8LoginUserData = (data:{item:string, value:any}) =>{
  try {
    localStorage.setItem('rel8User',JSON.stringify(data))
    return getRel8LoginUserData()
} catch (error) {
    console.log(error);
}
}




export const  getSubdomain =()=> {
  const hostname = window.location.hostname;

  // Split the hostname by dots
  const parts = hostname.split('.');

  // Check if there is a subdomain
  if (parts.length >= 3) {
    // The subdomain is the first part of the hostname
    const subdomain = parts[0];
    return subdomain;
  } else {
    // No subdomain found
    return null;
  }
}

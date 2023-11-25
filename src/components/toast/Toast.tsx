import { toast } from 'react-toastify';

const Toast = () => {

  const notifyUser = (message:string,type:'error'|'success') => type=='success'?toast.success(message):toast.error(message);

  return (
    {notifyUser}
  )
};

export default Toast;

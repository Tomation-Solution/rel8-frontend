import { useRef } from 'react';
import { BsUpload } from 'react-icons/bs';
import BreadCrumb from '../../../components/breadcrumb/BreadCrumb';

const ElectionCreateAspirantPage = () => {

    const options = ['Option 1', 'Option 2', 'Option 3'];
 
    const manifestoImagesInputRef = useRef<HTMLInputElement | null>(null);
    const manifestoDocumentInputRef = useRef<HTMLInputElement | null>(null);
    const manifestoVideoInputRef = useRef<HTMLInputElement | null>(null);
    const aspirantPhotoInputRef = useRef<HTMLInputElement | null>(null);
   
  

  const handleAspirantPhotoClick = () => {
    if (aspirantPhotoInputRef.current) {
      aspirantPhotoInputRef.current.click();
    }
  };
  const handleManifestoDocumentClick = () => {
    if (manifestoDocumentInputRef.current) {
      manifestoDocumentInputRef.current.click();
    }
  };
  const handleManifestoVideoClick = () => {
    if (manifestoVideoInputRef.current) {
      manifestoVideoInputRef.current.click();
    }
  };
  const handleManifestoImagesClick = () => {
    if (manifestoImagesInputRef.current) {
      manifestoImagesInputRef.current.click();
    }
  };

  return (
    <div>
    <BreadCrumb title="Election" />

    <div className='bg-neutral3 px-2 py-2 rounded-md grid w-1/2' >
        <label htmlFor="" className='font-light text-xs' >Category</label>
        {/* <div className="relative inline-block"> */}
      <select
        className="bg-#e6e7ea font-semibold text-#1E1E1E bg-neutral3 select-caret border-none outline-none w-full p-1 "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      
    {/* </div> */}
        
    </div>
    <div>
        <form action="" className="flex flex-col gap-3 w-full lg:w-1/2" >
            <div>
                <label htmlFor="" className="text-xs">Aspirant Name</label>
                <input type="text" placeholder="input name" className="auth-form-input py-3" />
            </div>
            <div>
                <label htmlFor="" className="text-xs">Upload Aspirant Photo</label>
                <div className="border border-gray-300 border-dashed relative group p-6 rounded-md">
                    <label
                        htmlFor="file-input"
                        className="flex items-center justify-center  cursor-pointer"
                        onClick={handleAspirantPhotoClick}
                    >
                        <BsUpload className="text-textColor w-6 h-6" />
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        ref={aspirantPhotoInputRef}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="bio" className="text-xs">Aspirant Bio</label>
                <input type="text" placeholder="bio" className="auth-form-input py-3" />
            </div>
            <div>
                <label htmlFor="" className="text-xs">Upload Manifesto Document</label>
                <div className="border border-gray-300 border-dashed relative group p-6 rounded-md">
                    <label
                        htmlFor="file-input"
                        className="flex items-center justify-center  cursor-pointer"
                        onClick={handleManifestoDocumentClick}
                    >
                        <BsUpload className="text-textColor w-6 h-6" />
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        ref={manifestoDocumentInputRef}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="" className="text-xs">Upload Manifesto Video</label>
                <div className="border border-gray-300 border-dashed relative group p-6 rounded-md">
                    <label
                        htmlFor="file-input"
                        className="flex items-center justify-center  cursor-pointer"
                        onClick={handleManifestoVideoClick}
                    >
                        <BsUpload className="text-textColor w-6 h-6" />
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        ref={manifestoVideoInputRef}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="" className="text-xs">Upload Manifesto Images</label>
                <div className="border border-gray-300 border-dashed relative group p-6 rounded-md">
                    <label
                        htmlFor="file-input"
                        className="flex items-center justify-center  cursor-pointer"
                        onClick={handleManifestoImagesClick}
                    >
                        <BsUpload className="text-textColor w-6 h-6" />
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        ref={manifestoImagesInputRef}
                        multiple
                    />
                </div>
            </div>
            <button className='bg-primaryBlue text-white p-3 rounded-md' > Add Aspirant</button>
        </form>
    </div>
</div>

  )
}

export default ElectionCreateAspirantPage
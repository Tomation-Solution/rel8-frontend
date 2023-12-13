
import { ColorRing } from  'react-loader-spinner'

const CircleLoader = () => {
  return (
    <div className='w-full h-full grid place-items-center fixed z-50	top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  ' >
      
    <ColorRing
  visible={true}
  height="100"
  width="100"
  ariaLabel="blocks-loading"
  wrapperStyle={{}}
  wrapperClass="blocks-wrapper"
  colors={['#015595', '#015595', '#015595', '#015595', '#015595']}
/>
    </div>
  )
}

export default CircleLoader
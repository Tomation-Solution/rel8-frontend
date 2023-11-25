
import { ColorRing } from  'react-loader-spinner'

const CircleLoader = () => {
  return (
    <div className='w-full h-full grid place-items-center' >
      
    <ColorRing
  visible={true}
  height="80"
  width="80"
  ariaLabel="blocks-loading"
  wrapperStyle={{}}
  wrapperClass="blocks-wrapper"
  colors={['#015595', '#015595', '#015595', '#015595', '#015595']}
/>
    </div>
  )
}

export default CircleLoader
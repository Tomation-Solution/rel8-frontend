// import { useQuery } from 'react-query';
// import { useParams } from 'react-router-dom';
// import { fetchElectionContestants } from '../../../api/elections/api-elections';
// import CircleLoader from '../../../components/loaders/CircleLoader';
// import Toast from '../../../components/toast/Toast';
// import React from 'react'

import avatarImg1 from '../../../assets/images/avatar-1.jpg'
import avatarImg2 from '../../../assets/images/avatar-2.jpg'
import avatarImg3 from '../../../assets/images/avatar-3.jpg'
import ElectionContestantCard from '../../../components/cards/ElectionContestantCard';

const ElectionContestantsPage = () => {

    // const {  electionPositionId } = useParams();
    // const { notifyUser } = Toast();

    // const id: string | null = electionPositionId || null;

    // const { data, isLoading, isError } = useQuery(['electionContestants',electionPositionId ], () => fetchElectionContestants(id),{
    //     enabled: !!id,
    //   });

    //   if (isError){
    //     notifyUser("An error occured while fetching event detail","error")
    //   }

    // if (isLoading){
    //     return <CircleLoader />
    // }

        

      // console.log(data)
  return (
    <main>
        <div className='grid grid-cols-4 gap-4' >
            <ElectionContestantCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
            <ElectionContestantCard image={avatarImg2} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
            <ElectionContestantCard image={avatarImg3} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
            <ElectionContestantCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
            <ElectionContestantCard image={avatarImg2} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
            <ElectionContestantCard image={avatarImg3} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
            <ElectionContestantCard image={avatarImg1} name='Adedeji Moyin' about='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit esse quis magni ipsum, molestias non fugiat, quos repudiandae ea culpa magnam repellat, iusto molestiae debitis reprehenderit veritatis expedita! Eveniet, quae.' />
          

        </div>
    </main>
  )
}

export default ElectionContestantsPage
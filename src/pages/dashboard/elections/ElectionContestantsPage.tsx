// import { useQuery } from 'react-query';
// import { useParams } from 'react-router-dom';
// import { fetchElectionContestants } from '../../../api/elections/api-elections';
// import CircleLoader from '../../../components/loaders/CircleLoader';
// import Toast from '../../../components/toast/Toast';
// import React from 'react'

import { useParams } from "react-router-dom";
import avatarImg1 from "../../../assets/images/avatar-1.jpg";
import avatarImg2 from "../../../assets/images/avatar-2.jpg";
import avatarImg3 from "../../../assets/images/avatar-3.jpg";
import ElectionContestantCard from "../../../components/cards/ElectionContestantCard";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { useQuery } from "react-query";
import { fetchElectionContestants } from "../../../api/elections/api-elections";
import { useEffect } from "react";
import apiTenant from "../../../api/baseApi";

const ElectionContestantsPage = () => {
  const { electionPositionId } = useParams();
  const { notifyUser } = Toast();

  const token = localStorage.getItem("token");

  const id: string | null = electionPositionId || null;

  const { data, isLoading, isError, refetch } = useQuery(
    ["electionContestants", electionPositionId],
    () => fetchElectionContestants(id),
    {
      enabled: !!id,
    }
  );

  const handleRefetch = () => {
    refetch();
  };

  if (isError) {
    notifyUser("An error occured while fetching event detail", "error");
  }

  if (isLoading) {
    return <CircleLoader />;
  }

  console.log(data);
  return (
    <main>
      <div className="grid grid-cols-4 gap-4">
        {data?.length === 0 ? (
          <div className="col-span-4 text-center">
            <h3 className="text-lg font-semibold">No Contestants Found</h3>
            <p className="text-sm text-gray-500">
              There are currently no contestants for this election position.
            </p>
          </div>
        ) : (
          data?.map((contestant: any) => (
            <ElectionContestantCard
              key={contestant._id}
              image={contestant.imageUrl}
              name={contestant.name}
              about={contestant.bio}
              id={contestant._id}
              electionPositionId={electionPositionId}
              refetch={handleRefetch}
            />
          ))
        )}
      </div>
    </main>
  );
};

export default ElectionContestantsPage;

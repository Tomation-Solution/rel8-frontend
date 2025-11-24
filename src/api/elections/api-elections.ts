import apiTenant from "../baseApi";




export const fetchElections = async () =>{
    const response = await apiTenant.get(`/api/elections/`);
    return response.data
}

export const fetchPositions = async () =>{
    const response = await apiTenant.get(`/api/positions/`);
    return response.data
}

export const fetchElectionStatsForMembers = async () =>{
    const response = await apiTenant.get(`/api/elections/member-stats`);
    return response.data
}

export const fetchElectionDetails = async (id: string) =>{
    const response = await apiTenant.get(`/api/elections/${id}/details`);
    return response.data
}

export const castVote = async (candidateId: string) =>{
    const response = await apiTenant.post(`/api/elections/vote`, { candidateId });
    return response.data
}

export const fetchElectionResults = async (electionId: string) => {
    const response = await apiTenant.get(`/api/elections/results/${electionId}`);
    return response.data
}
export const fetchElectionContestants = async (id:string|null) =>{
    console.log('sdsddsds')
    if (id){
        
        const response = await apiTenant.get(`/election/adminmanageballotbox/list_of_contestant/?election_id=${id}`);
        // const response = await apiTenant.get(`/election/adminmanageballotbox/list_of_contestant/?election_id=3`);
        return response.data
    }
    // console.log('hahah',id)
    // const response = await apiTenant.get(`/election/adminmanageballotbox/list_of_contestant/?election_id=${id}`);
    // const response = await apiTenant.get(`/election/adminmanageballotbox/list_of_contestant/?postion_id=${id}`);
    // return response.data
   
}
// export const voteContestant = async (data: {ballotBoxID: number, contestantID: number, vote: boolean}) =>{
//     const response = await apiTenant.get(`/election/adminmanageballotbox/vote_for_contestant/`,data);
//     return response.data
// }




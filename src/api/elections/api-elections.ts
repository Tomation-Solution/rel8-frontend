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
/**
 * Removed: `fetchElectionContestants`.
 *
 * It called `/election/adminmanageballotbox/list_of_contestant/` — a Django-style path with
 * no `/api` prefix that this backend does not mount — and had no callers left. Candidates
 * come from `GET /api/elections/:id/details` (already used by `ElectionDetailsPage`) or
 * `GET /api/elections/:electionId/candidates`.
 */

// export const voteContestant = async (data: {ballotBoxID: number, contestantID: number, vote: boolean}) =>{
//     const response = await apiTenant.get(`/election/adminmanageballotbox/vote_for_contestant/`,data);
//     return response.data
// }




import apiTenant from "../baseApi";

export type CommitteeMember = {
  _id: string;
  name: string;
  email: string;
};

export type CommitteeType = {
  _id: string;
  name: string;
  description: string;
  chairperson: CommitteeMember;
  members: CommitteeMember[];
  positions: string[];
  chatGroupId: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
};

export const fetchAllCommittees = async () => {
  const response = await apiTenant.get(`/api/committees`);
  return response.data;
};

export const fetchMyCommittees = async (): Promise<CommitteeType[]> => {
  const response = await apiTenant.get(`/api/committees/my`);
  return response.data;
};

export const fetchCommitteeDetails = async (id: string | number) => {
  const response = await apiTenant.get(`/api/committees/${id}`);
  return response.data;
};

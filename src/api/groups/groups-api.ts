import apiTenant from "../baseApi";

export type GroupPosition = {
  _id: string;
  name: string;
  title: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
  order: number;
  memberId?: string;
};

export type GroupType = {
  _id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  hasChat?: boolean;
  positions: GroupPosition[];
  orgId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type GroupMember = {
  _id: string;
  name: string;
  email?: string;
  imageUrl?: string;
};

export const fetchAllGroups = async (): Promise<GroupType[]> => {
  const response = await apiTenant.get("/api/groups");
  return response.data.groups || response.data || [];
};

export const fetchGroupById = async (id: string): Promise<GroupType> => {
  const response = await apiTenant.get(`/api/groups/${id}`);
  return response.data.group || response.data;
};

export const fetchGroupMembers = async (id: string): Promise<GroupMember[]> => {
  const response = await apiTenant.get(`/api/groups/${id}/members`);
  return response.data.members || response.data || [];
};

import apiTenant from "../baseApi";

export interface MemberTypeRecord {
  _id: string;
  name: string;
  description?: string;
  orgId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MemberTypeWithMembers {
  memberType: MemberTypeRecord;
  members: MemberTypeMember[];
}

export interface MemberTypeMember {
  _id: string;
  name: string;
  email?: string;
  profileImage?: string;
  imageUrl?: string;
  position?: string;
  memberType?: string;
}

export const fetchMemberTypes = async (): Promise<MemberTypeRecord[]> => {
  const response = await apiTenant.get("/api/member-types");
  return response.data.memberTypes || response.data || [];
};

export const createMemberType = async (data: { name: string; description?: string }): Promise<MemberTypeRecord> => {
  const response = await apiTenant.post("/api/member-types", data);
  return response.data.memberType || response.data;
};

export const updateMemberType = async (id: string, data: { name?: string; description?: string }): Promise<MemberTypeRecord> => {
  const response = await apiTenant.put(`/api/member-types/${id}`, data);
  return response.data.memberType || response.data;
};

export const deleteMemberType = async (id: string): Promise<void> => {
  await apiTenant.delete(`/api/member-types/${id}`);
};

export const fetchMemberTypeMembers = async (id: string): Promise<MemberTypeWithMembers> => {
  const response = await apiTenant.get(`/api/member-types/${id}/members`);
  return response.data;
};

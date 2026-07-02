import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FiLock, FiUsers, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import CircleLoader from "../../../components/loaders/CircleLoader";
import Toast from "../../../components/toast/Toast";
import { useAppContext } from "../../../context/authContext";
import { fetchMemberTypes, createMemberType, updateMemberType, deleteMemberType, MemberTypeRecord } from "../../../api/member-types/member-types-api";

const MemberTypesPage = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();

  // user.memberType can be { _id, name } or just a string id
  const userMemberTypeId: string | null = typeof user?.memberType === "object" ? user.memberType?._id : (user?.memberType ?? null);

  const isAdmin: boolean = user?.role === "admin" || user?.isAdmin === true;

  const { data: memberTypes, isLoading } = useQuery("memberTypes", fetchMemberTypes, {
    onError: () => notifyUser("Failed to load membership types", "error"),
  });

  // Admin: create type
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Admin: edit type
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const createMutation = useMutation((data: { name: string; description?: string }) => createMemberType(data), {
    onSuccess: () => {
      queryClient.invalidateQueries("memberTypes");
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
      notifyUser("Membership type created", "success");
    },
    onError: (err: any) => {
      notifyUser(err?.response?.data?.message || "Failed to create type", "error");
    },
  });

  const updateMutation = useMutation(({ id, data }: { id: string; data: { name?: string; description?: string } }) => updateMemberType(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries("memberTypes");
      setEditingId(null);
      notifyUser("Membership type updated", "success");
    },
    onError: (err: any) => {
      notifyUser(err?.response?.data?.message || "Failed to update type", "error");
    },
  });

  const deleteMutation = useMutation((id: string) => deleteMemberType(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("memberTypes");
      notifyUser("Membership type deleted", "success");
    },
    onError: (err: any) => {
      notifyUser(err?.response?.data?.message || "Cannot delete — members still assigned", "error");
    },
  });

  const handleCardClick = (type: MemberTypeRecord) => {
    const isMine = userMemberTypeId === type._id;
    if (!isMine && !isAdmin) return;
    navigate(`/member-types/${type._id}`);
  };

  const startEdit = (type: MemberTypeRecord) => {
    setEditingId(type._id);
    setEditName(type.name);
    setEditDesc(type.description ?? "");
  };

  if (isLoading) return <CircleLoader />;

  const types: MemberTypeRecord[] = memberTypes ?? [];

  return (
    <main>
      <BreadCrumb title="Members Environment" />

      {/* Admin: create new type */}
      {isAdmin && (
        <div className="mb-6">
          {showCreate ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-md">
              <h3 className="font-semibold text-gray-700 mb-3">New Membership Type</h3>
              <input type="text" placeholder="Type name" value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-org-primary" />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-org-primary"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => createMutation.mutate({ name: newName.trim(), description: newDesc.trim() || undefined })}
                  disabled={!newName.trim() || createMutation.isLoading}
                  className="bg-org-primary text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {createMutation.isLoading ? "Creating…" : "Create"}
                </button>
                <button
                  onClick={() => {
                    setShowCreate(false);
                    setNewName("");
                    setNewDesc("");
                  }}
                  className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 text-sm text-org-primary border border-org-primary px-4 py-2 rounded-lg hover:bg-org-primary hover:text-white transition-colors">
              <FiPlus size={16} /> Create Membership Type
            </button>
          )}
        </div>
      )}

      {types.length === 0 && <p className="text-gray-400 text-sm py-16 text-center">No membership types have been created yet.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {types.map(type => {
          const isMine = userMemberTypeId === type._id;
          const canEnter = isMine || isAdmin;

          return (
            <div key={type._id} className={`relative bg-white border rounded-xl overflow-hidden transition-shadow ${canEnter ? "border-gray-200 hover:shadow-md cursor-pointer" : "border-gray-100 opacity-60 cursor-not-allowed"}`}>
              {/* Colour bar */}
              <div className={`h-2 ${canEnter ? "bg-org-primary" : "bg-gray-300"}`} />

              <div className="p-4" onClick={() => handleCardClick(type)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-org-primary/10 flex items-center justify-center">
                    <FiUsers size={18} className="text-org-primary" />
                  </div>
                  {!canEnter && <FiLock size={16} className="text-gray-400" />}
                  {isMine && <span className="text-xs font-medium bg-org-primary/10 text-org-primary px-2 py-0.5 rounded-full">Your Type</span>}
                </div>

                <h3 className="font-semibold text-gray-800 text-base mt-3">{type.name}</h3>
                {type.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{type.description}</p>}

                {canEnter && <p className="text-xs text-org-primary mt-3 font-medium">View Members →</p>}
                {!canEnter && <p className="text-xs text-gray-400 mt-3">You are not a member of this type</p>}
              </div>

              {/* Admin actions */}
              {isAdmin && editingId !== type._id && (
                <div className="border-t border-gray-100 px-4 py-2 flex gap-3">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      startEdit(type);
                    }}
                    className="text-xs text-gray-500 hover:text-org-primary flex items-center gap-1"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${type.name}"?`)) deleteMutation.mutate(type._id);
                    }}
                    className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              )}

              {/* Inline edit form */}
              {isAdmin && editingId === type._id && (
                <div className="border-t border-gray-100 p-4" onClick={e => e.stopPropagation()}>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm mb-2" placeholder="Type name" />
                  <input type="text" value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm mb-2" placeholder="Description (optional)" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateMutation.mutate({ id: type._id, data: { name: editName.trim(), description: editDesc.trim() || undefined } })}
                      disabled={!editName.trim() || updateMutation.isLoading}
                      className="bg-org-primary text-white px-3 py-1.5 rounded text-xs font-medium disabled:opacity-50"
                    >
                      {updateMutation.isLoading ? "Saving…" : "Save"}
                    </button>
                    <button onClick={() => setEditingId(null)} className="border border-gray-300 px-3 py-1.5 rounded text-xs text-gray-600">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default MemberTypesPage;

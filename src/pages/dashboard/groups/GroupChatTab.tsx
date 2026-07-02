import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { io } from "socket.io-client";
import { BsPeople } from "react-icons/bs";
import { fetchGroupMembers, GroupMember } from "../../../api/groups/groups-api";
import { getUserOrNull } from "../../../utils/extra_functions";
import { useAppContext } from "../../../context/authContext";
import { GroupPanel, PrivatePanel } from "./GroupConversationPanel";
import { ENDPOINT_URL } from "../../../utils/constants";
import profileImage from "../../../assets/images/dummy.jpg";

type SelectedRoom = { kind: "group" } | { kind: "private"; member: GroupMember };

interface Props {
  groupId: string;
  groupName: string;
}

const GroupChatTab = ({ groupId, groupName }: Props) => {
  const [selected, setSelected] = useState<SelectedRoom>({ kind: "group" });
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const loggedInUser = getUserOrNull();
  const { user } = useAppContext();
  const queryClient = useQueryClient();

  // Stable MongoDB ObjectId string — same source PrivatePanel uses
  const myId = String((user as any)?._id ?? user?.id ?? (loggedInUser as any)?._id ?? loggedInUser?.id ?? "");

  // Keep a ref to selected so socket event handlers don't capture stale closures
  const selectedRef = useRef<SelectedRoom>(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // ── Badge-tracking socket: group namespace ───────────────────────
  useEffect(() => {
    const token: string | undefined = (() => {
      try {
        return JSON.parse(localStorage.getItem("rel8User") ?? "")?.token;
      } catch {
        return undefined;
      }
    })();
    const socket = io(ENDPOINT_URL, { auth: { token }, transports: ["websocket", "polling"] });
    socket.on("connect", () => socket.emit("joinGroup", groupId));
    socket.on("groupMessage", () => {
      if (selectedRef.current.kind !== "group") {
        setUnreadCounts(prev => ({ ...prev, group: (prev.group ?? 0) + 1 }));
      }
    });
    return () => {
      socket.emit("leaveGroup", groupId);
      socket.disconnect();
    };
  }, [groupId]);

  // ── Badge-tracking socket: private namespace ─────────────────────
  useEffect(() => {
    if (!myId) return;

    const token: string | undefined = (() => {
      try {
        return JSON.parse(localStorage.getItem("rel8User") ?? "")?.token;
      } catch {
        return undefined;
      }
    })();

    const socket = io(`${ENDPOINT_URL}/private`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("privateMessage", (msg: any) => {
      const recipientId = String(msg.recipientId?._id ?? msg.recipientId ?? "");
      const senderId = String(msg.senderId?._id ?? msg.senderId ?? "");

      if (recipientId !== myId) return;

      const sel = selectedRef.current;
      if (sel.kind === "private" && sel.member._id === senderId) return;

      setUnreadCounts(prev => ({
        ...prev,
        [senderId]: (prev[senderId] ?? 0) + 1,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [myId]);

  // ── Room selection (clears unread + invalidates cached history so
  //    the panel fetches fresh messages on mount) ───────────────────
  const handleSelect = (room: SelectedRoom) => {
    setSelected(room);
    if (room.kind === "group") {
      setUnreadCounts(prev => ({ ...prev, group: 0 }));
      queryClient.invalidateQueries(["groupChatHistory", groupId]);
    } else {
      setUnreadCounts(prev => ({ ...prev, [room.member._id]: 0 }));
      queryClient.invalidateQueries(["privateChat", room.member._id]);
    }
  };

  const { data: members, isLoading: membersLoading } = useQuery(["groupMembers", groupId], () => fetchGroupMembers(groupId), { enabled: !!groupId });

  const otherMembers: GroupMember[] = (members ?? []).filter(m => String(m._id) !== String(loggedInUser?.id));

  return (
    <div className="flex border rounded-lg overflow-hidden bg-white" style={{ height: "calc(100vh - 280px)", minHeight: 480 }}>
      {/* ── Left: Room list ─────────────────────────────────────────── */}
      <div className="w-60 flex-shrink-0 border-r flex flex-col">
        <div className="px-3 py-2.5 border-b bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rooms</p>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Group Chat room */}
          <button onClick={() => handleSelect({ kind: "group" })} className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-100 transition-colors hover:bg-gray-50 ${selected.kind === "group" ? "bg-org-primary/10" : ""}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${selected.kind === "group" ? "bg-org-primary text-white" : "bg-org-primary/20 text-org-primary"}`}>
              <BsPeople className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold truncate ${selected.kind === "group" ? "text-org-primary" : "text-gray-800"}`}>Group Chat</p>
              <p className="text-xs text-gray-400 truncate">{groupName}</p>
            </div>
            {!!unreadCounts.group && <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">{unreadCounts.group > 99 ? "99+" : unreadCounts.group}</span>}
          </button>

          {/* Member rooms header */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Members</p>
          </div>

          {membersLoading ? (
            <div className="px-4 py-3 text-gray-400 text-sm">Loading members…</div>
          ) : otherMembers.length === 0 ? (
            <div className="px-4 py-3 text-gray-400 text-xs">No other members</div>
          ) : (
            otherMembers.map(member => {
              const isActive = selected.kind === "private" && selected.member._id === member._id;
              const unread = unreadCounts[member._id] ?? 0;
              return (
                <button key={member._id} onClick={() => handleSelect({ kind: "private", member })} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${isActive ? "bg-org-primary/10" : ""}`}>
                  <img src={member.imageUrl || profileImage} alt={member.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-org-primary" : "text-gray-800"}`}>{member.name}</p>
                    {member.email && <p className="text-xs text-gray-400 truncate">{member.email}</p>}
                  </div>
                  {!!unread && <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">{unread > 99 ? "99+" : unread}</span>}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right: Conversation panel ────────────────────────────────── */}
      <div className="flex-1 min-w-0">{selected.kind === "group" ? <GroupPanel groupId={groupId} groupName={groupName} /> : <PrivatePanel member={selected.member} />}</div>
    </div>
  );
};

export default GroupChatTab;

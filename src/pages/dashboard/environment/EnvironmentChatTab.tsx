import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { io } from "socket.io-client";
import { BsPeople } from "react-icons/bs";
import { fetchEnvironmentMembers, EnvironmentMember } from "../../../api/environments/environments-api";
import { getUserOrNull } from "../../../utils/extra_functions";
import { useAppContext } from "../../../context/authContext";
import { EnvironmentPanel, PrivatePanel } from "./EnvironmentConversationPanel";
import { ENDPOINT_URL } from "../../../utils/constants";
import profileImage from "../../../assets/images/dummy.jpg";
import { getSessionToken } from "../../../utils/session";

type SelectedRoom = { kind: "environment" } | { kind: "private"; member: EnvironmentMember };

interface Props {
  environmentId: string;
  environmentName: string;
  /** Open straight into a private conversation with this member ("Chat Up"). */
  initialMemberId?: string | null;
}

const EnvironmentChatTab = ({ environmentId, environmentName, initialMemberId }: Props) => {
  const [selected, setSelected] = useState<SelectedRoom>({ kind: "environment" });

  /* Which of the two panes a phone is looking at. Ignored from `md` up, where both show. */
  const [mobileShowConversation, setMobileShowConversation] = useState(false);
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

  // ── Badge-tracking socket: environment namespace ─────────────────
  useEffect(() => {
    const token: string | undefined = (() => {
      try {
        return getSessionToken();
      } catch {
        return undefined;
      }
    })();
    const socket = io(ENDPOINT_URL, { auth: { token }, transports: ["websocket", "polling"] });
    socket.on("connect", () => socket.emit("joinEnvironment", environmentId));
    socket.on("environmentMessage", () => {
      if (selectedRef.current.kind !== "environment") {
        setUnreadCounts(prev => ({ ...prev, environment: (prev.environment ?? 0) + 1 }));
      }
    });
    return () => {
      socket.emit("leaveEnvironment", environmentId);
      socket.disconnect();
    };
  }, [environmentId]);

  // ── Badge-tracking socket: private namespace ─────────────────────
  useEffect(() => {
    if (!myId) return;

    const token: string | undefined = (() => {
      try {
        return getSessionToken();
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
    setMobileShowConversation(true);
    if (room.kind === "environment") {
      setUnreadCounts(prev => ({ ...prev, environment: 0 }));
      queryClient.invalidateQueries(["environmentChatHistory", environmentId]);
    } else {
      setUnreadCounts(prev => ({ ...prev, [room.member._id]: 0 }));
      queryClient.invalidateQueries(["privateChat", room.member._id]);
    }
  };

  const { data: members, isLoading: membersLoading } = useQuery(["environmentMembers", environmentId], () => fetchEnvironmentMembers(environmentId), { enabled: !!environmentId });

  const otherMembers: EnvironmentMember[] = (members ?? []).filter(m => String(m._id) !== String(loggedInUser?.id));

  // "Chat Up" lands here with a member id. Select them once their record arrives; after
  // that the member's own clicks own the selection.
  const appliedInitialRef = useRef(false);
  useEffect(() => {
    if (appliedInitialRef.current || !initialMemberId || !members) return;
    const target = members.find(m => String(m._id) === String(initialMemberId));
    if (target) {
      appliedInitialRef.current = true;
      setSelected({ kind: "private", member: target });
      // "Chat Up" is an explicit request for that conversation — open it, not the list.
      setMobileShowConversation(true);
    }
  }, [initialMemberId, members]);

  /*
   * Phones show one pane at a time.
   *
   * The room list is a fixed 240px rail, which left about 135px of a 375px screen for the
   * conversation — messages wrapped to two or three words a line and the composer had no
   * room for its send button. Below `md` the list and the conversation are now separate
   * screens, with a back arrow in the conversation header; from `md` up both panes show
   * side by side exactly as before.
   */
  const closeConversation = () => setMobileShowConversation(false);

  return (
    <div className="flex border rounded-lg overflow-hidden bg-white h-[calc(100dvh-220px)] min-h-[480px] md:h-[calc(100vh-280px)]">
      {/* ── Left: Room list ─────────────────────────────────────────── */}
      <div className={`w-full md:w-60 flex-shrink-0 border-r flex-col ${mobileShowConversation ? "hidden md:flex" : "flex"}`}>
        <div className="px-3 py-2.5 border-b bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rooms</p>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* The environment-wide room */}
          <button onClick={() => handleSelect({ kind: "environment" })} className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-100 transition-colors hover:bg-gray-50 ${selected.kind === "environment" ? "bg-org-primary/10" : ""}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${selected.kind === "environment" ? "bg-org-primary text-white" : "bg-org-primary/20 text-org-primary"}`}>
              <BsPeople className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold truncate ${selected.kind === "environment" ? "text-org-primary" : "text-gray-800"}`}>Environment Chat</p>
              <p className="text-xs text-gray-400 truncate">{environmentName}</p>
            </div>
            {!!unreadCounts.environment && <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">{unreadCounts.environment > 99 ? "99+" : unreadCounts.environment}</span>}
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
      <div className={`flex-1 min-w-0 ${mobileShowConversation ? "flex flex-col" : "hidden md:flex md:flex-col"}`}>
        {selected.kind === "environment" ? (
          <EnvironmentPanel environmentId={environmentId} environmentName={environmentName} onBack={closeConversation} />
        ) : (
          <PrivatePanel member={selected.member} onBack={closeConversation} />
        )}
      </div>
    </div>
  );
};

export default EnvironmentChatTab;

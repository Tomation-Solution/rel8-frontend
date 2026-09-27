import { io, Socket } from "socket.io-client";
import { ENDPOINT_URL } from "./constants";
import { getSessionToken } from "./session";

let socket: Socket | null = null;

export const getSupportSocket = (): Socket | null => {
  const token = getSessionToken();
  if (!token) return null;

  if (!socket) {
    socket = io(ENDPOINT_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};

export const disconnectSupportSocket = () => {
  socket?.disconnect();
  socket = null;
};

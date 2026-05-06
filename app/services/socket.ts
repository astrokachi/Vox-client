import { io, Socket } from "socket.io-client";

let socket: Socket;

export async function initSocket(token: string) {
  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token },
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("connected", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("connect_error:", err.message);
    console.log(err);
  });

  return socket;
}

export { socket };

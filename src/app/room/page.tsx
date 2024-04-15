"use client";

import { useSearchParams } from "next/navigation";
import RoomPage from "./compo";
import { useEffect } from "react";
import { socket } from "@/socket";
import { useLoggedInUserData } from "@/stores/chat-store";

export default function Page() {
  const { email } = useLoggedInUserData();
  useEffect(() => {
    socket.emit("room:join", { email, room: 1 });
  }, []);

  return (
    <div>
      <RoomPage />
    </div>
  );
}

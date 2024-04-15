"use client";

import { useSearchParams } from "next/navigation";
import RoomPage from "./compo";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { useLoggedInUserData } from "@/stores/chat-store";

export default function Page() {
  const [myStream, setMyStream] = useState<MediaStream | null>();

  const { email } = useLoggedInUserData();
  useEffect(() => {
    socket.emit("room:join", { email, room: 1 });
  }, []);

  return (
    <div>
      <RoomPage myStream={myStream} setMyStream={setMyStream} />
    </div>
  );
}

import { socket } from "@/socket";
import {
  Message,
  useAvailableUsers,
  useLoggedInUserData,
  useSentMessages,
} from "@/stores/chat-store";
import { useEffect, useState, useMemo, useRef } from "react";
import type { FormEvent, Ref, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RoomPage from "@/app/room/compo";
import peer from "@/service/peer";

export default function MessageForm({ currentUser }: { currentUser: string }) {
  const { addMessage, messages } = useSentMessages();
  const { email, avatar } = useLoggedInUserData();
  const [currentConvo, setCurrentConvo] = useState(
    messages.get(currentUser) || []
  );
  const { users } = useAvailableUsers();
  const chatRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    socket.on("chat-message", (msg: Message) => {
      if (msg.sentBy === currentUser) {
        setCurrentConvo((prev) => [...prev, msg]);
      }
      addMessage(msg.sentBy, msg);
      console.log("Message by server is : ", msg);
    });

    return () => {
      socket.off("chat-message");
    };
  });

  useEffect(() => {
    if (chatRef.current) {
      // chatRef.current.scrollTop = chatRef.current.scrollHeight;
      chatRef.current?.scrollIntoView({
        block: "start",
        behavior: "instant",
        inline: "start",
      });
    }
  }, [currentConvo]);

  return (
    <>
      <ScrollArea className=" h-full w-full rounded-md border">
        <div className="grid gap-4 p-4 h-full w-full overflow-y-scroll ">
          {currentConvo.map((msg, i) => (
            <div
              className={`flex items-start gap-4  justify-start ${
                msg.sentBy === currentUser ? "" : " flex-row-reverse"
              }`}
              key={msg.message.substring(0, 10) as string}
              ref={i === currentConvo.length - 1 ? chatRef : null}
            >
              <Image
                alt="User"
                className="rounded-full justify-self-start border-2 border-black"
                height={40}
                src={
                  currentUser === msg.sentBy
                    ? users.filter((user) => user.email === currentUser)[0]
                        ?.avatar || ""
                    : avatar || ""
                }
                style={{
                  aspectRatio: "40/40",
                  objectFit: "cover",
                }}
                width={40}
              />
              <div
                className={`grid gap-2 border-2 border-black/30  px-6 py-3 rounded-lg shadow ${
                  currentUser === msg.sentBy ? " bg-blue-100 " : "bg-green-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{msg.sentBy}</h3>
                  <time className="text-sm font-medium peer">
                    2:14 PM
                    <div className="absolute z-10 hidden w-max p-1 -top-3 peer:active:top-3 peer:scale-100 translate-x-1/2 scale-95 bg-black text-white rounded-md">
                      Seen
                    </div>
                  </time>
                </div>
                <p className="text-lg font-medium text-gray-500 peer group:last-child:mb-0 dark:text-gray-400">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <SendMessageUi
        selectedUser={currentUser}
        setCurrentConvo={setCurrentConvo}
      />
    </>
  );
}

function SendMessageUi({
  selectedUser,
  setCurrentConvo,
}: {
  selectedUser: string;
  setCurrentConvo: (value: SetStateAction<Message[]>) => void;
}) {
  const [message, setMessage] = useState("");
  const { email: loggedInUser } = useLoggedInUserData();
  const { addMessage } = useSentMessages();

  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const msg = { sentBy: loggedInUser, message: message };
    addMessage(selectedUser, msg);
    setCurrentConvo((convo) => [...convo, msg]);
    socket.emit("chat-message", { msg, email: selectedUser });
    setMessage("");
  };
  const call = () => {
    // router.push("/room");
    socket.emit("room:join", { email: loggedInUser, room: 1 });
  };

  return (
    <>
      <form className="flex items-center gap-4" onSubmit={handleSubmit}>
        <Input
          className="flex-1"
          placeholder="Type a message..."
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button>Send</Button>
      </form>

      <Dialog
        onOpenChange={(state) => {
          console.log(state);
          if (!state) {
            peer.closeConn();
          }
          socket.emit("room:leave");
        }}
      >
        <DialogTrigger>
          <span onClick={call}>Call</span>
        </DialogTrigger>
        <DialogContent>
          {/* <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader> */}
          <RoomPage />
        </DialogContent>
      </Dialog>
    </>
  );
}

/* <Button className="flex-1" variant="outline">
        <SmileIcon className="w-4 h-4 mr-2" />
        Emoji
      </Button>
      <Button className="flex-1" variant="outline">
        <ImageIcon className="w-4 h-4 mr-2" />
        Image
      </Button> */

function SmileIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

function ImageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

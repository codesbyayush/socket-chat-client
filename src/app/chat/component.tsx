"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { socket } from "@/socket";
import {
  User,
  useAvailableUsers,
  useLoggedInUserData,
} from "@/stores/chat-store";
import MessageForm from "@/components/login/message-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Component({
  user,
}: {
  user: { name: string; email: string; avatar: string };
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const { name, updateUser } = useLoggedInUserData();
  const { addUser, removeUser, users, clearUsers } = useAvailableUsers();

  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    console.log("In effect: user :", user);
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
      updateUser(user);
      socket.emit("register:user", user);
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
      clearUsers();
    }

    async function onNewUserConnected(user: User) {
      addUser({
        ...user,
        avatar: user.avatar || "",
      });
      console.log(users);
    }

    function onUserDisconnected(email: string) {
      removeUser(email);
      console.log(users);
    }

    function userListOnServer(userlist: User[]) {
      console.log("server sent", userlist);
      userlist.map((user) => {
        addUser(user);
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("user:connected", onNewUserConnected);
    socket.on("user:disconnected", onUserDisconnected);
    socket.on("list:users", userListOnServer);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("user:connected", onNewUserConnected);
      socket.off("user:disconnected", onUserDisconnected);
      socket.off("list:users", userListOnServer);
    };
  }, [socket]);

  return (
    <div className="h-screen flex flex-col border border-gray-800 dark:border-gray-800">
      <header className="flex items-center px-4 border-b h-12">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="w-6 h-6" />
          <h1 className="text-lg font-semibold">SocketChat</h1>
        </div>
      </header>
      <div className="grid grid-cols-3 flex-1 min-h-0">
        <div className="flex flex-col border-r min-h-0">
          {/* <div className="flex items-center gap-2 h-12 px-4 border-b min-h-0">
            <Input
              className="w-full flex-1 h-8"
              placeholder="Search"
              type="search"
            />
            <Button size="sm" variant="outline">
              <SearchIcon className="w-4 h-4" />
            </Button>
          </div> */}
          <ScrollArea className="h-screen w-full rounded-md border">
            <div className="p-4 flex-col flex gap-2">
              {users.map((user) => (
                <Button
                  key={user.email}
                  className={`border-2  border-black px-4 py-7 cursor-pointer w-full rounded shadow-md flex gap-3 justify-start bg-white text-black hover:text-white overflow-hidden ${
                    currentUser === user.email ? " bg-black/25" : ""
                  }`}
                  onClick={() => setCurrentUser(user.email)}
                >
                  <Image
                    alt="User"
                    className="rounded-full justify-self-start border-2 border-black"
                    height={40}
                    src={
                      users.filter((userr) => userr.email === user.email)[0]
                        ?.avatar || ""
                    }
                    style={{
                      aspectRatio: "40/40",
                      objectFit: "cover",
                    }}
                    width={40}
                  />
                  <span className="overflow-ellipsis w-full">{user.email}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex flex-col min-h-0 col-span-2 max-h-full">
          <div className="flex h-12 items-center px-4 border-b min-h-0 py-6">
            <Image
              alt="User"
              className="rounded-full border-2 border-black"
              height={24}
              src={
                users.filter((user) => user.email === currentUser)[0]?.avatar ||
                ""
              }
              style={{
                aspectRatio: "24/24",
                objectFit: "cover",
              }}
              width={24}
            />
            <h2 className="text-sm font-semibold ml-2">{currentUser}</h2>
            <div className="flex-1" />
          </div>
          <div className="flex-1 flex flex-col justify-end gap-4 p-4 max-h-full overflow-hidden">
            <MessageForm currentUser={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRightIcon(props: any) {
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
      <path d="m9 18 6-6-6-6" />
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

function MessageSquareIcon(props: any) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function PhoneIcon(props: any) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function SearchIcon(props: any) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

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

function VideoIcon(props: any) {
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
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}

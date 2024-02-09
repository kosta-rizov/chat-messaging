"use client";
import { pusherClient } from "@/lib/pusher";
import { chatConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import UnseenChatNotification from "./unseenChatNotification";

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message{
  senderImg: string
  senderName: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const ruter = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((mes) => !pathname.includes(mes.senderId));
      });
    }
  }, [pathname]);

  useEffect(() => {
    // listening 
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

    const newFriendHandler = () => {
      ruter.refresh()
    }

    const chatHandler = (message: ExtendedMessage) => {
      const notify = pathname !== `/dashboard/chat/${chatConstructor(sessionId, message.senderId)}`

      if(!notify) return

      toast.custom((t) => (
        <UnseenChatNotification 
        t = {t}
        senderId = {message.senderId}
        sessionId = {sessionId}
        senderImg = {message.senderImg}
        senderName = {message.senderName}
        senderMessage = {message.text}
        />
      ))
      setUnseenMessages((prev) => [...prev, message])
    }

    //bind
    pusherClient.bind('new_message', chatHandler)
    pusherClient.bind('new_friend', newFriendHandler)

    // clean
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
    }

  },[sessionId, ruter, pathname])

  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends?.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseen) => {
          return unseen.senderId === friend.id;
        }).length;

        return (
          <li key={friend.id}>
            <a
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              href={`/dashboard/chat/${chatConstructor(sessionId, friend.id)}`}
            >
              {friend.name}
              {unseenMessagesCount > 0 ? (
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;

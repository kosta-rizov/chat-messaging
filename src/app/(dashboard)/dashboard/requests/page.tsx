import FriendRequests from "@/components/friendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { ArrowLeftCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";

const Requests: FC = async () => {
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  // find id who sent friend request
  const incomingSendId = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];

  const incomingFriendRequests = await Promise.all(
    incomingSendId.map(async (senderId) => {
      const sender = (await fetchRedis("get", `user:${senderId}`)) as string;
      const senderParst = JSON.parse(sender) as User;

      return {
        senderId,
        senderEmail: senderParst.email,
      };
    })
  );

  return (
    <main className="pt-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
        <Link href="/dashboard" className="md:hidden hover:text-slate-700">
          <ArrowLeftCircle />
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <FriendRequests
          incomingFriendRequests={incomingFriendRequests}
          sessionId={session.user.id}
        />
      </div>
    </main>
  );
};

export default Requests;

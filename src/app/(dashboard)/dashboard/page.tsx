import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import SidebarChatList from "@/components/SidebarChatList";
import { getFriendsByUserId } from "@/helpers/get-friends";
import { fetchRedis } from "@/helpers/redis";
import FriendRequestOption from "@/components/friendRequestOption";
import Link from "next/link";
import { SidebarOption } from "@/types/typings";
import { Icons } from "@/components/Icons";
import SignOutButton from "@/components/signOutButton";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  // check if no user
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);

  const requestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session?.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  const sidebarOptions: SidebarOption[] = [
    {
      id: 1,
      name: "Add friend",
      href: "/dashboard/add",
      Icon: "UserPlus",
    },
  ];

  return (
    <div>
      <div className="max-sm:flex-col flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 justify-between">
        <div>
          <div className="relative h-[100px] w-[100px] bg-gray-50 max-sm:justify-center">
            <Image
              fill
              src={session.user.image || ""}
              referrerPolicy="no-referrer"
              alt="Your profile picture"
            />
          </div>

          <div className="flex flex-col">
            <span aria-hidden="true">{session.user.name || ""}</span>
            <span className="text-xs text-zinc-400" aria-hidden="true">
              {session.user?.email || ""}
            </span>
          </div>
        </div>
        <SignOutButton title="Sign Out" className="h-full aspect-square md:hidden"/>
      </div>

      <ul role="list" className="-mx-2 mt-2 space-y-1 md:hidden">
        {sidebarOptions.map((option) => {
          const Icon = Icons[option.Icon];
          return (
            <li key={option.id}>
              <Link
                href={option.href}
                className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
              >
                <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate">{option.name}</span>
              </Link>
            </li>
          );
        })}

        <li>
          <FriendRequestOption
            sessionId={session.user.id}
            initialRequestCount={requestCount}
          />
        </li>

          <li className=" ml-5">
            {friends.length > 0 && (
              <div className="text-xs font-semibold leading-6 text-gray-400 mt-6">
                Your chats
              </div>
            )}
            <SidebarChatList sessionId={session.user.id} friends={friends} />
          </li>

      </ul>



    </div>
  );
};

export default Dashboard;

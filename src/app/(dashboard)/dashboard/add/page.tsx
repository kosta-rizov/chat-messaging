import AddFriendButton from "@/components/addFriendButton";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

const Add = ({}) => {
  return (
    <main className="pt-8">
      <div className="flex justify-between">
        <h1 className="font-bold text-5xl mb-8">Add Friend</h1>
        <Link href="/dashboard" className="md:hidden hover:text-slate-700">
          <ArrowLeftCircle />
        </Link>
      </div>
      <AddFriendButton />
    </main>
  );
};

export default Add;

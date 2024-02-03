import { db } from "@/lib/db";
import Login from "./login/page";

export default async function Home() {

  await db.set("hello", "hello")

  return (
    <Login />
  );
}


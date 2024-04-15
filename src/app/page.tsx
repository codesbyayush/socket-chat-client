import { currentUser } from "@clerk/nextjs";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser();
  if (user) return <main className="">{user.primaryEmailAddressId}</main>;
}

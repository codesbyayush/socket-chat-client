import { currentUser } from "@clerk/nextjs";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser();
  console.log(user);
  if (user) return <main className="">{user.primaryEmailAddressId}</main>;
}

import { currentUser } from "@clerk/nextjs";
import Component from "./component";

async function Page() {
  const currUser = await currentUser();
  let currName = "";
  if (currUser?.firstName) currName += currUser?.firstName;
  if (currUser?.lastName) currName += ` ${currUser?.lastName}`;
  let avatar = currUser?.imageUrl || "";
  let email = currUser?.emailAddresses[0].emailAddress || "";

  const user = { name: currName, email, avatar };

  return (
    <div>
      <Component user={user} />
    </div>
  );
}

export default Page;

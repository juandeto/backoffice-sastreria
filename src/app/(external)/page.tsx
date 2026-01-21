import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard/congressmen");
  return <>Coming Soon</>;
}

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/sections/congressmen");
  return <>Coming Soon</>;
}

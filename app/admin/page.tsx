import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/login");
  }
  return <AdminDashboard />;
}

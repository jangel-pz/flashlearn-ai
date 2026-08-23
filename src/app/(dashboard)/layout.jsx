import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/AppShell";

export default async function DashboardLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: decks, error: decksError } = await supabase
    .from("decks")
    .select("id, title")
    .order("created_at", { ascending: false });

  if (decksError) {
    console.error(decksError);
  }

  return <AppShell decks={decks ?? []}>{children}</AppShell>;
}

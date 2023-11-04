import Sample from '@/components/Sample'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-col items-center">
      <Sample/>
    </div>
  )
}

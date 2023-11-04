import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import styles from "../../style.module.css";
import Messages from "./messages";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export const dynamic = "force-dynamic";

export default async function Login() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col items-center">
      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 "
        action="/auth/sign-in"
        method="post"
      >
        <Card>
          <CardHeader>
            <CardTitle>Log In / Sign Up</CardTitle>
            <CardDescription>
              Log into your account or sign up for a new one to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Label className="text-md" htmlFor="email">
              Email
            </Label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border"
              name="email"
              placeholder="you@example.com"
              required
            />
            <Button className={styles.button}>Continue</Button>
            <Messages />
          </CardContent>

        </Card>
      </form>
    </div>
  )
}
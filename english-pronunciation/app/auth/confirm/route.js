import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { EmailOtpType } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const requestUrl = new URL(req.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/';
  const action = searchParams.get('action');

  console.log("from confirm", req.url);

  if (token_hash && type) {
    const supabase = createRouteHandlerClient({ cookies })
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      if (action === "signin")
        return NextResponse.redirect(new URL(`/${next.slice(1)}`, req.url))
      else
        return NextResponse.redirect(
          `${requestUrl.origin}/login?message=Sign up successfully. Sign email to log in process again`,
          {
            // a 301 status is required to redirect from a POST to a GET route
            status: 301,
          }
        )
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', req.url))
}
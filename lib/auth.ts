'use client'

import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export async function signUp(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data.user!
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user!
}

export async function logOut(): Promise<void> {
  await supabase.auth.signOut()
}

export function onAuthChange(cb: (user: User | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user ?? null)
  })
  return () => subscription.unsubscribe()
}

export async function getUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export function isDogforceAdmin(userId: string, email?: string | null): boolean {
  const adminUid   = process.env.NEXT_PUBLIC_DOGFORCE_ADMIN_UID
  const adminEmail = process.env.NEXT_PUBLIC_DOGFORCE_ADMIN_EMAIL
  if (adminUid   && userId === adminUid)   return true
  if (adminEmail && email  === adminEmail) return true
  return false
}

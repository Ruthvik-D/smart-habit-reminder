import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { fetchProfile } from '../services/profileService'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const userId = session?.user?.id ?? null
  const awaitingConfirmation = Boolean(session?.user) && !session.user.email_confirmed_at

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!awaitingConfirmation) return undefined
    const recheckConfirmation = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user?.email_confirmed_at) return
      await supabase.auth.refreshSession()
    }
    recheckConfirmation()
    window.addEventListener('focus', recheckConfirmation)
    return () => window.removeEventListener('focus', recheckConfirmation)
  }, [awaitingConfirmation])

  useEffect(() => {
    if (!userId) return undefined
    let active = true
    fetchProfile(userId)
      .then((nextProfile) => {
        if (active) setProfile(nextProfile)
      })
      .catch(() => {
        if (active) setProfile(null)
      })
    return () => {
      active = false
    }
  }, [userId])

  const value = useMemo(() => {
    const refreshProfile = async () => {
      if (!userId) return
      try {
        setProfile(await fetchProfile(userId))
      } catch {
        setProfile(null)
      }
    }
    return {
      session,
      user: session?.user ?? null,
      profile: userId ? profile : null,
      loading,
      refreshProfile,
    }
  }, [session, userId, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { supabase } from '../lib/supabase'

function toAuthErrorMessage(error) {
  const message = error.message?.toLowerCase() ?? ''
  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in instead.'
  }
  if (message.includes('invalid login credentials')) return 'Incorrect email or password.'
  if (message.includes('email not confirmed')) {
    return 'This email has not been confirmed yet. Please contact support.'
  }
  if (message.includes('password')) return error.message
  if (message.includes('fetch') || message.includes('network')) {
    return 'Network error. Check your connection and try again.'
  }
  return 'Something went wrong. Please try again.'
}

export async function signUp({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  })
  if (error) throw new Error(toAuthErrorMessage(error))
  if (data.user && data.user.identities?.length === 0) {
    throw new Error('An account with this email already exists. Try signing in instead.')
  }
  return data
}

export async function signIn({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(toAuthErrorMessage(error))
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('Could not sign you out. Please try again.')
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw new Error(toAuthErrorMessage(error))
}

import { supabase } from '../lib/supabase'

const EMAIL_NOT_CONFIRMED_MESSAGE =
  'Your email address is not verified yet. Check your inbox for the verification link.'
export const VERIFICATION_LINK_EXPIRED_MESSAGE = 'This verification link has expired. Request a new one below.'
export const VERIFICATION_LINK_INVALID_MESSAGE =
  'This verification link is invalid or has expired. Request a new one below.'
const RESEND_GENERIC_ERROR_MESSAGE = 'We could not send a new link right now. Please try again shortly.'

function createAuthError(message, code) {
  const error = new Error(message)
  error.code = code
  return error
}

function toAuthErrorMessage(error) {
  const message = error.message?.toLowerCase() ?? ''
  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in instead.'
  }
  if (message.includes('invalid login credentials')) return 'Incorrect email or password.'
  if (message.includes('password')) return error.message
  if (message.includes('fetch') || message.includes('network')) {
    return 'Network error. Check your connection and try again.'
  }
  return 'Something went wrong. Please try again.'
}

export function getVerificationRedirectUrl() {
  return `${window.location.origin}/auth/callback`
}

export async function signUp({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: getVerificationRedirectUrl(),
    },
  })
  if (error) throw new Error(toAuthErrorMessage(error))
  if (data.user && data.user.identities?.length === 0) {
    throw new Error('An account with this email already exists. Try signing in instead.')
  }
  return data
}

export async function signIn({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    if (error.code === 'email_not_confirmed') {
      throw createAuthError(EMAIL_NOT_CONFIRMED_MESSAGE, 'email_not_confirmed')
    }
    throw new Error(toAuthErrorMessage(error))
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('Could not sign you out. Please try again.')
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw new Error(toAuthErrorMessage(error))
}

export async function verifyEmailToken({ tokenHash, type }) {
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
  if (error) throw createAuthError(VERIFICATION_LINK_INVALID_MESSAGE, 'otp_invalid')
}

export async function completeVerifiedSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session?.user?.email_confirmed_at) {
    throw createAuthError(VERIFICATION_LINK_INVALID_MESSAGE, 'otp_invalid')
  }
}

export async function resendVerificationEmail(email) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: getVerificationRedirectUrl() },
  })
  if (!error) return
  if (error.status === 429 || error.code === 'over_email_send_rate_limit') {
    throw createAuthError('Please wait a moment before requesting another email.', 'rate_limited')
  }
  throw createAuthError(RESEND_GENERIC_ERROR_MESSAGE, 'resend_failed')
}

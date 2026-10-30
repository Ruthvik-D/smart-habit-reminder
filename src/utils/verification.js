export const RESEND_COOLDOWN_SECONDS = 60

const PENDING_EMAIL_KEY = 'pendingVerificationEmail'
const RESEND_UNTIL_KEY = 'verificationResendUntil'
const VERIFICATION_OTP_TYPES = ['signup', 'email']

export function getPendingEmail() {
  return sessionStorage.getItem(PENDING_EMAIL_KEY) ?? ''
}

export function setPendingEmail(email) {
  sessionStorage.setItem(PENDING_EMAIL_KEY, email)
}

export function clearPendingEmail() {
  sessionStorage.removeItem(PENDING_EMAIL_KEY)
}

export function getResendCooldownEnd() {
  return Number(sessionStorage.getItem(RESEND_UNTIL_KEY)) || 0
}

export function startResendCooldown() {
  sessionStorage.setItem(RESEND_UNTIL_KEY, String(Date.now() + RESEND_COOLDOWN_SECONDS * 1000))
}

export function readCallbackParams(search, hash) {
  const query = new URLSearchParams(search)
  const fragment = new URLSearchParams(hash.replace(/^#/, ''))

  const tokenHash = query.get('token_hash')
  const type = query.get('type')
  if (tokenHash && VERIFICATION_OTP_TYPES.includes(type)) {
    return { kind: 'token', tokenHash, type }
  }

  const errorCode = fragment.get('error_code') ?? query.get('error_code')
  if (errorCode || fragment.get('error') || query.get('error')) {
    return { kind: 'error', errorCode: errorCode ?? '' }
  }

  if (fragment.get('access_token')) return { kind: 'session' }
  return { kind: 'missing' }
}

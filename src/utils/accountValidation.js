const DISPLAY_NAME_MAX = 60
const PASSWORD_MIN = 8

export function validateProfileForm(form) {
  const errors = {}
  const displayName = form.displayName.trim()
  if (!displayName) errors.displayName = 'Please enter a name.'
  else if (displayName.length > DISPLAY_NAME_MAX) {
    errors.displayName = `Keep your name under ${DISPLAY_NAME_MAX} characters.`
  }
  return errors
}

export function validatePasswordForm(form) {
  const errors = {}
  if (form.password.length < PASSWORD_MIN) {
    errors.password = `Use at least ${PASSWORD_MIN} characters.`
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'The passwords do not match.'
  }
  return errors
}

import { supabase } from '../lib/supabase'

const PROFILE_COLUMNS = 'id, display_name, reminders_enabled, created_at'

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle()
  if (error) throw new Error('Could not load your profile.')
  return data
}

export async function updateProfile(userId, patch) {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select(PROFILE_COLUMNS)
    .maybeSingle()
  if (error) throw new Error('Could not save your profile. Please try again.')
  if (!data) throw new Error('Your profile could not be found.')
  return data
}

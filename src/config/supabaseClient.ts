import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPA_BASE_PROJECT_KEY ?? ''
const supabaseKey = process.env.REACT_APP_SUPA_BASE_PROJECT_API_KEY ?? ''

export const supabase = createClient(supabaseUrl, atob(supabaseKey.replaceAll('mmaacc', 'm')))

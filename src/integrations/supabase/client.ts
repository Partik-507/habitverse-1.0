
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://aawjtwpufhawmjjffvmu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhd2p0d3B1Zmhhd21qamZmdm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0OTAxMDUsImV4cCI6MjA2NzA2NjEwNX0.VZl-hBx1roFTBhFTB3r2wnja2WIXXDA57ZKyKtjAze0'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our data
export interface Lead {
  id: string
  customer_id: string
  source: string
  status: "new" | "assigned" | "contacted" | "qualified"
  priority: "low" | "medium" | "high"
  services: string[]
  description: string
  assigned_to?: string
  last_contact?: string
  created_at: string
  updated_at: string
  customer?: {
    id: string
    first_name: string
    last_name: string
    email?: string
    phone?: string
    address?: string
  }
  assigned_user?: {
    id: string
    name: string
    email: string
  }
}

export interface Customer {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
  created_at: string
}

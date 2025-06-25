import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: "public",
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
})

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
  customer?: Customer
  assigned_user?: User
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

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface BlueSheet {
  id: string
  customer_id: string
  designer_id: string
  status: "draft" | "in_progress" | "review" | "approved" | "completed"
  priority: "low" | "medium" | "high"
  services: string[]
  project_type: string
  completion_percentage: number
  created_at: string
  updated_at: string
  customer?: Customer
  designer?: User
}

export interface DesignProject {
  id: string
  customer_id: string
  title: string
  status: "needs-estimate" | "pending-approval" | "approved" | "on-hold"
  project_type: "residential" | "commercial" | "municipal"
  area: string
  description?: string
  budget_range?: string
  timeline?: string
  design_style?: string
  maintenance_level?: string
  plant_preferences?: string
  staff_notes?: string
  created_at: string
  updated_at: string
  customer?: Customer
}

export interface Estimate {
  id: string
  design_project_id: string
  estimate_number: string
  status: "draft" | "internal-review" | "sent-to-customer" | "under-negotiation" | "approved" | "rejected" | "expired"
  total_amount: number
  subtotal: number
  markup_percentage: number
  markup_amount: number
  tax_percentage: number
  tax_amount: number
  notes?: string
  terms?: string
  created_at: string
  updated_at: string
  expires_at: string
  sent_at?: string
  approved_at?: string
  design_project?: DesignProject
}

export interface EstimateLineItem {
  id: string
  estimate_id: string
  category: string
  description: string
  quantity: number
  unit: string
  unit_price: number
  total: number
  created_at: string
}

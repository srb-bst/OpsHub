"use client"

import { useState, useEffect } from "react"
import { supabase, type Lead } from "@/lib/supabase"

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("leads")
        .select(`
          *,
          customer:customers(*),
          assigned_user:users(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createLead = async (leadData: Partial<Lead>) => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .insert(leadData)
        .select(`
          *,
          customer:customers(*),
          assigned_user:users(*)
        `)
        .single()

      if (error) throw error
      setLeads([data, ...leads])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create lead")
      throw err
    }
  }

  return { leads, loading, error, createLead, refetch: fetchLeads }
}

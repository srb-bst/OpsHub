"use client"

import { useState, useEffect } from "react"
import { supabase, type BlueSheet } from "@/lib/supabase"

export function useBlueSheets() {
  const [blueSheets, setBlueSheets] = useState<BlueSheet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlueSheets()
  }, [])

  const fetchBlueSheets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("blue_sheets")
        .select(`
          *,
          customer:customers(*),
          designer:users(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBlueSheets(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const createBlueSheet = async (blueSheetData: Partial<BlueSheet>) => {
    try {
      const { data, error } = await supabase
        .from("blue_sheets")
        .insert(blueSheetData)
        .select(`
          *,
          customer:customers(*),
          designer:users(*)
        `)
        .single()

      if (error) throw error
      setBlueSheets([data, ...blueSheets])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create blue sheet")
      throw err
    }
  }

  return { blueSheets, loading, error, createBlueSheet, refetch: fetchBlueSheets }
}

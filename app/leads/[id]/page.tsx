"use client"

import { useState, useEffect } from "react"
import { notFound, useParams } from "next/navigation"
import { LeadDetailPage } from "@/components/lead-detail-page"
import { supabase } from "@/lib/supabase"

export default function LeadDetailPageRoute() {
  const params = useParams()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchLead() {
      try {
        setLoading(true)

        // Fetch lead
        const { data: leadData, error: leadError } = await supabase
          .from("leads")
          .select("*")
          .eq("id", params.id)
          .single()

        if (leadError) {
          console.error("Lead error:", leadError)
          setError(true)
          return
        }

        // Fetch customer separately
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", leadData.customer_id)
          .single()

        if (customerError) {
          console.error("Customer error:", customerError)
        }

        // Transform the data
        const transformedLead = {
          id: leadData.id.toString(),
          name: customerData ? `${customerData.first_name} ${customerData.last_name}` : "Unknown Customer",
          phone: customerData?.phone || "",
          email: customerData?.email || "",
          address: customerData?.address || "",
          source: leadData.source || "Unknown",
          services: leadData.services || [],
          description: leadData.description || "",
          timeAgo: getTimeAgo(leadData.created_at),
          status: leadData.status || "new",
          priority: leadData.priority || "medium",
          budget: leadData.budget || "",
          timeline: leadData.timeline || "",
          notes: leadData.notes || "",
          createdAt: leadData.created_at,
          updatedAt: leadData.updated_at || leadData.created_at,
        }

        setLead(transformedLead)
      } catch (error) {
        console.error("Error fetching lead:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchLead()
    }
  }, [params.id])

  function getTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Less than an hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 7) return `${diffInDays} days ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks === 1) return "1 week ago"
    return `${diffInWeeks} weeks ago`
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
        <div className="max-w-4xl mx-auto pt-16 lg:pt-0">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading lead details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !lead) {
    return notFound()
  }

  return <LeadDetailPage lead={lead} />
}

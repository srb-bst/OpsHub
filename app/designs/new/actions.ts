"use server"

import { createClient } from "@supabase/supabase-js"

export async function createDesignProject(formData: FormData) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const data = {
      customer_name: formData.get("customerName") as string,
      customer_phone: (formData.get("customerPhone") as string) || null,
      customer_email: (formData.get("customerEmail") as string) || null,
      customer_address: formData.get("customerAddress") as string,
      customer_city: (formData.get("customerCity") as string) || null,
      customer_state: (formData.get("customerState") as string) || null,
      customer_zip: (formData.get("customerZip") as string) || null,
      title: (formData.get("title") as string) || `${formData.get("customerName")} - ${formData.get("projectType")}`,
      project_type: formData.get("projectType") as string,
      area: formData.get("area") as string,
      description: (formData.get("description") as string) || null,
      budget_range: (formData.get("budgetRange") as string) || null,
      timeline: (formData.get("timeline") as string) || null,
      design_style: (formData.get("designStyle") as string) || null,
      maintenance_level: (formData.get("maintenanceLevel") as string) || null,
      plant_preferences: (formData.get("plantPreferences") as string) || null,
      staff_notes: (formData.get("staffNotes") as string) || null,
      initial_design_notes: (formData.get("initialDesignNotes") as string) || null,
      recommended_plants: (formData.get("recommendedPlants") as string) || null,
      status: "needs-estimate",
    }

    const { error } = await supabase.from("design_projects").insert([data])

    if (error) {
      console.error("Database error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Failed to create project" }
  }
}

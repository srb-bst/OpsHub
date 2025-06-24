"use client"

import { Check, Circle, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProcessStep {
  id: string
  label: string
  status: "completed" | "current" | "upcoming"
  optional?: boolean
}

interface ProcessIndicatorProps {
  steps: ProcessStep[]
  className?: string
}

export function ProcessIndicator({ steps, className = "" }: ProcessIndicatorProps) {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                step.status === "completed"
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : step.status === "current"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-white border-slate-300 text-slate-400"
              }`}
            >
              {step.status === "completed" ? (
                <Check className="w-4 h-4" />
              ) : (
                <Circle className="w-3 h-3 fill-current" />
              )}
            </div>
            <div className="flex flex-col">
              <span
                className={`text-sm font-medium ${
                  step.status === "current"
                    ? "text-blue-900"
                    : step.status === "completed"
                      ? "text-emerald-900"
                      : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
              {step.optional && (
                <Badge variant="outline" className="text-xs w-fit">
                  Optional
                </Badge>
              )}
            </div>
          </div>
          {index < steps.length - 1 && <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0 mx-1" />}
        </div>
      ))}
    </div>
  )
}

// Helper function to get process steps for different workflows
export function getLeadWorkflowSteps(currentStatus: string): ProcessStep[] {
  const allSteps = [
    { id: "lead", label: "Lead Capture", status: "completed" as const },
    { id: "consultation", label: "Consultation", status: "upcoming" as const, optional: true },
    { id: "design", label: "Design", status: "upcoming" as const },
    { id: "blue-sheet", label: "Blue Sheet", status: "upcoming" as const },
    { id: "estimate", label: "Estimate", status: "upcoming" as const },
    { id: "approval", label: "Approval", status: "upcoming" as const },
    { id: "scheduling", label: "Scheduling", status: "upcoming" as const },
    { id: "completion", label: "Completion", status: "upcoming" as const },
  ]

  // Update status based on current status
  const statusMap: { [key: string]: number } = {
    new: 0,
    "consultation-scheduled": 1,
    "consultation-completed": 1,
    "design-in-progress": 2,
    "blue-sheet-created": 3,
    "ready-for-estimate": 4,
    estimated: 4,
    approved: 5,
    scheduled: 6,
    "in-progress": 6,
    completed: 7,
  }

  const currentStepIndex = statusMap[currentStatus] || 0

  return allSteps.map((step, index) => ({
    ...step,
    status: index < currentStepIndex ? "completed" : index === currentStepIndex ? "current" : "upcoming",
  }))
}

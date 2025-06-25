"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit3, Save, X, Phone, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CrewMember {
  id: string
  name: string
  initials: string
  role: string
  team: "team1" | "team2" | "team3" | "delivery"
  hoursPerWeek: number
  phone: string
  email: string
  skills: string[]
  certifications: string[]
  availability: "available" | "busy" | "unavailable" | "vacation"
  currentJobs: number
  maxJobs: number
  hourlyRate: number
  startDate: string
  notes: string
  emergencyContact: string
  emergencyPhone: string
}

interface Team {
  id: string
  name: string
  description: string
  color: string
  members: CrewMember[]
  capacity: number
  currentWorkload: number
}

const initialCrewMembers: CrewMember[] = [
  {
    id: "1",
    name: "Mike Rodriguez",
    initials: "MR",
    role: "Lead Installer",
    team: "team1",
    hoursPerWeek: 40,
    phone: "(555) 123-4567",
    email: "mike.rodriguez@company.com",
    skills: ["Installation", "Hardscape", "Irrigation", "Tree Services"],
    certifications: ["Pesticide License", "CDL"],
    availability: "available",
    currentJobs: 1,
    maxJobs: 2,
    hourlyRate: 28,
    startDate: "2023-01-15",
    notes: "Excellent with customer interactions. Prefers morning starts.",
    emergencyContact: "Maria Rodriguez",
    emergencyPhone: "(555) 123-4568",
  },
  {
    id: "2",
    name: "Tom Wilson",
    initials: "TW",
    role: "Installation Specialist",
    team: "team1",
    hoursPerWeek: 40,
    phone: "(555) 234-5678",
    email: "tom.wilson@company.com",
    skills: ["Installation", "Tree Services", "Maintenance"],
    certifications: ["Arborist Certification"],
    availability: "busy",
    currentJobs: 2,
    maxJobs: 2,
    hourlyRate: 25,
    startDate: "2023-03-01",
    notes: "Great with tree work and pruning. Available for overtime.",
    emergencyContact: "Sarah Wilson",
    emergencyPhone: "(555) 234-5679",
  },
  {
    id: "3",
    name: "Carlos Garcia",
    initials: "CG",
    role: "Hardscape Specialist",
    team: "team2",
    hoursPerWeek: 40,
    phone: "(555) 345-6789",
    email: "carlos.garcia@company.com",
    skills: ["Hardscape", "Installation", "Design", "Heavy Equipment"],
    certifications: ["Heavy Equipment Operator"],
    availability: "available",
    currentJobs: 0,
    maxJobs: 2,
    hourlyRate: 30,
    startDate: "2022-08-15",
    notes: "Expert in stone work and patios. Bilingual Spanish/English.",
    emergencyContact: "Ana Garcia",
    emergencyPhone: "(555) 345-6790",
  },
  {
    id: "4",
    name: "James Chen",
    initials: "JC",
    role: "Maintenance Lead",
    team: "team2",
    hoursPerWeek: 35,
    phone: "(555) 456-7890",
    email: "james.chen@company.com",
    skills: ["Maintenance", "Tree Services", "Installation", "Irrigation Repair"],
    certifications: ["Irrigation Certification"],
    availability: "available",
    currentJobs: 1,
    maxJobs: 3,
    hourlyRate: 26,
    startDate: "2023-05-01",
    notes: "Excellent troubleshooter. Good with irrigation systems.",
    emergencyContact: "Lisa Chen",
    emergencyPhone: "(555) 456-7891",
  },
  {
    id: "5",
    name: "David Martinez",
    initials: "DM",
    role: "Installation Crew",
    team: "team3",
    hoursPerWeek: 32,
    phone: "(555) 567-8901",
    email: "david.martinez@company.com",
    skills: ["Installation", "Planting", "Mulching"],
    certifications: [],
    availability: "available",
    currentJobs: 1,
    maxJobs: 2,
    hourlyRate: 22,
    startDate: "2024-01-10",
    notes: "Part-time student. Available weekends and some weekdays.",
    emergencyContact: "Rosa Martinez",
    emergencyPhone: "(555) 567-8902",
  },
  {
    id: "6",
    name: "Steve Johnson",
    initials: "SJ",
    role: "Delivery Driver",
    team: "delivery",
    hoursPerWeek: 40,
    phone: "(555) 678-9012",
    email: "steve.johnson@company.com",
    skills: ["Delivery", "Material Handling", "Customer Service"],
    certifications: ["CDL", "Forklift Operator"],
    availability: "available",
    currentJobs: 0,
    maxJobs: 4,
    hourlyRate: 24,
    startDate: "2023-06-01",
    notes: "Reliable driver. Knows all delivery routes well.",
    emergencyContact: "Betty Johnson",
    emergencyPhone: "(555) 678-9013",
  },
  {
    id: "7",
    name: "Alex Thompson",
    initials: "AT",
    role: "Delivery Assistant",
    team: "delivery",
    hoursPerWeek: 30,
    phone: "(555) 789-0123",
    email: "alex.thompson@company.com",
    skills: ["Delivery", "Material Handling"],
    certifications: [],
    availability: "available",
    currentJobs: 0,
    maxJobs: 3,
    hourlyRate: 20,
    startDate: "2024-02-15",
    notes: "Part-time position. Strong and reliable.",
    emergencyContact: "Mark Thompson",
    emergencyPhone: "(555) 789-0124",
  },
]

export function CrewManagement() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>(initialCrewMembers)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string>("all")

  const teams: Team[] = [
    {
      id: "team1",
      name: "Team 1",
      description: "Primary installation and landscaping crew",
      color: "bg-emerald-500",
      members: crewMembers.filter((m) => m.team === "team1"),
      capacity: 80,
      currentWorkload: crewMembers
        .filter((m) => m.team === "team1")
        .reduce((acc, m) => acc + (m.currentJobs / m.maxJobs) * m.hoursPerWeek, 0),
    },
    {
      id: "team2",
      name: "Team 2",
      description: "Specialized hardscape and maintenance crew",
      color: "bg-blue-500",
      members: crewMembers.filter((m) => m.team === "team2"),
      capacity: 75,
      currentWorkload: crewMembers
        .filter((m) => m.team === "team2")
        .reduce((acc, m) => acc + (m.currentJobs / m.maxJobs) * m.hoursPerWeek, 0),
    },
    {
      id: "team3",
      name: "Team 3",
      description: "Flexible crew for overflow and special projects",
      color: "bg-purple-500",
      members: crewMembers.filter((m) => m.team === "team3"),
      capacity: 32,
      currentWorkload: crewMembers
        .filter((m) => m.team === "team3")
        .reduce((acc, m) => acc + (m.currentJobs / m.maxJobs) * m.hoursPerWeek, 0),
    },
    {
      id: "delivery",
      name: "Delivery",
      description: "Material delivery and logistics team",
      color: "bg-orange-500",
      members: crewMembers.filter((m) => m.team === "delivery"),
      capacity: 70,
      currentWorkload: crewMembers
        .filter((m) => m.team === "delivery")
        .reduce((acc, m) => acc + (m.currentJobs / m.maxJobs) * m.hoursPerWeek, 0),
    },
  ]

  const handleEditMember = (memberId: string) => {
    setEditingMember(memberId)
  }

  const handleSaveMember = (memberId: string, updatedData: Partial<CrewMember>) => {
    setCrewMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, ...updatedData } : member)))
    setEditingMember(null)
  }

  const handleCancelEdit = () => {
    setEditingMember(null)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-700"
      case "busy":
        return "bg-yellow-100 text-yellow-700"
      case "unavailable":
        return "bg-red-100 text-red-700"
      case "vacation":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getWorkloadPercentage = (member: CrewMember) => {
    return (member.currentJobs / member.maxJobs) * 100
  }

  const filteredMembers = selectedTeam === "all" ? crewMembers : crewMembers.filter((m) => m.team === selectedTeam)

  return (
    <div className="p-4 lg:p-8 bg-slate-50/30 min-h-screen lg:ml-0">
      <div className="max-w-7xl mx-auto pt-16 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 mb-1">Crew Management</h1>
            <p className="text-slate-600">Manage team members, schedules, and assignments</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowAddMemberDialog(true)}
              className="h-12 px-4 text-base font-medium bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-none"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Team Member
            </Button>
          </div>
        </div>

        <Tabs value={selectedTeam} onValueChange={setSelectedTeam} className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <TabsList className="h-12 bg-white/80 backdrop-blur-sm rounded-lg border-slate-200/60 shadow-none p-1 w-full lg:w-auto grid grid-cols-2 lg:grid-cols-5">
              <TabsTrigger
                value="all"
                className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-slate-500 data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                All Teams ({crewMembers.length})
              </TabsTrigger>
              {teams.map((team) => (
                <TabsTrigger
                  key={team.id}
                  value={team.id}
                  className="px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  {team.name} ({team.members.length})
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Team Overview Cards */}
          <div className="grid gap-4 lg:grid-cols-4 mb-8">
            {teams.map((team) => (
              <Card key={team.id} className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${team.color}`}></div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                    </div>
                    <Badge className="bg-slate-100 text-slate-700 border-0">{team.members.length} members</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-slate-600 mb-3">{team.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Weekly Capacity</span>
                      <span className="font-medium">
                        {Math.round(team.currentWorkload)}/{team.capacity} hrs
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${team.color} transition-all`}
                        style={{ width: `${Math.min((team.currentWorkload / team.capacity) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{team.members.filter((m) => m.availability === "available").length} available</span>
                      <span>{Math.round((team.currentWorkload / team.capacity) * 100)}% utilized</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <TabsContent value="all" className="space-y-4">
            <CrewMembersList
              members={filteredMembers}
              editingMember={editingMember}
              onEdit={handleEditMember}
              onSave={handleSaveMember}
              onCancel={handleCancelEdit}
              getAvailabilityColor={getAvailabilityColor}
              getWorkloadPercentage={getWorkloadPercentage}
            />
          </TabsContent>

          {teams.map((team) => (
            <TabsContent key={team.id} value={team.id} className="space-y-4">
              <CrewMembersList
                members={team.members}
                editingMember={editingMember}
                onEdit={handleEditMember}
                onSave={handleSaveMember}
                onCancel={handleCancelEdit}
                getAvailabilityColor={getAvailabilityColor}
                getWorkloadPercentage={getWorkloadPercentage}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Add Member Dialog */}
        <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>Add a new crew member to your team</DialogDescription>
            </DialogHeader>
            <AddMemberForm
              onSave={(newMember) => {
                setCrewMembers((prev) => [...prev, { ...newMember, id: Date.now().toString() }])
                setShowAddMemberDialog(false)
              }}
              onCancel={() => setShowAddMemberDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

interface CrewMembersListProps {
  members: CrewMember[]
  editingMember: string | null
  onEdit: (id: string) => void
  onSave: (id: string, data: Partial<CrewMember>) => void
  onCancel: () => void
  getAvailabilityColor: (availability: string) => string
  getWorkloadPercentage: (member: CrewMember) => number
}

function CrewMembersList({
  members,
  editingMember,
  onEdit,
  onSave,
  onCancel,
  getAvailabilityColor,
  getWorkloadPercentage,
}: CrewMembersListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {members.map((member) => (
        <CrewMemberCard
          key={member.id}
          member={member}
          isEditing={editingMember === member.id}
          onEdit={() => onEdit(member.id)}
          onSave={(data) => onSave(member.id, data)}
          onCancel={onCancel}
          getAvailabilityColor={getAvailabilityColor}
          getWorkloadPercentage={getWorkloadPercentage}
        />
      ))}
    </div>
  )
}

interface CrewMemberCardProps {
  member: CrewMember
  isEditing: boolean
  onEdit: () => void
  onSave: (data: Partial<CrewMember>) => void
  onCancel: () => void
  getAvailabilityColor: (availability: string) => string
  getWorkloadPercentage: (member: CrewMember) => number
}

function CrewMemberCard({
  member,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  getAvailabilityColor,
  getWorkloadPercentage,
}: CrewMemberCardProps) {
  const [editData, setEditData] = useState(member)

  const handleSave = () => {
    onSave(editData)
  }

  if (isEditing) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                  className="font-semibold text-lg h-8 p-1"
                />
                <Input
                  value={editData.role}
                  onChange={(e) => setEditData((prev) => ({ ...prev, role: e.target.value }))}
                  className="text-sm text-slate-600 h-6 p-1 mt-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} size="sm" className="h-8 w-8 p-0 bg-emerald-500 hover:bg-emerald-600">
                <Save className="h-4 w-4" />
              </Button>
              <Button onClick={onCancel} size="sm" variant="outline" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700">Hours/Week</label>
              <Input
                type="number"
                value={editData.hoursPerWeek}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, hoursPerWeek: Number.parseInt(e.target.value) || 0 }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Team</label>
              <Select
                value={editData.team}
                onValueChange={(value) => setEditData((prev) => ({ ...prev, team: value as any }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team1">Team 1</SelectItem>
                  <SelectItem value="team2">Team 2</SelectItem>
                  <SelectItem value="team3">Team 3</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700">Phone</label>
              <Input
                value={editData.phone}
                onChange={(e) => setEditData((prev) => ({ ...prev, phone: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Hourly Rate</label>
              <Input
                type="number"
                value={editData.hourlyRate}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, hourlyRate: Number.parseFloat(e.target.value) || 0 }))
                }
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Notes</label>
            <Textarea
              value={editData.notes}
              onChange={(e) => setEditData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-xl border-slate-200/60 shadow-none hover:shadow-sm transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">{member.name}</h3>
              <p className="text-sm text-slate-600">{member.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getAvailabilityColor(member.availability)} border-0 capitalize`}>
              {member.availability}
            </Badge>
            <Button onClick={onEdit} size="sm" variant="outline" className="h-8 w-8 p-0">
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="h-3 w-3" />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-3 w-3" />
              <span>{member.hoursPerWeek} hrs/week</span>
            </div>
          </div>

          {/* Workload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Current Workload</span>
              <span className="text-sm font-medium">
                {member.currentJobs}/{member.maxJobs} jobs ({Math.round(getWorkloadPercentage(member))}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  getWorkloadPercentage(member) >= 100
                    ? "bg-red-500"
                    : getWorkloadPercentage(member) >= 75
                      ? "bg-yellow-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(getWorkloadPercentage(member), 100)}%` }}
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-sm text-slate-600 mb-2">Skills</p>
            <div className="flex flex-wrap gap-1">
              {member.skills.slice(0, 3).map((skill) => (
                <Badge
                  key={skill}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md font-medium border-0"
                >
                  {skill}
                </Badge>
              ))}
              {member.skills.length > 3 && (
                <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-xs px-2 py-1 rounded-md font-medium border-0">
                  +{member.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Certifications */}
          {member.certifications.length > 0 && (
            <div>
              <p className="text-sm text-slate-600 mb-2">Certifications</p>
              <div className="flex flex-wrap gap-1">
                {member.certifications.map((cert) => (
                  <Badge
                    key={cert}
                    className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-xs px-2 py-1 rounded-md font-medium border-0"
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {member.notes && (
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs text-slate-600">{member.notes}</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center pt-2 border-t border-slate-100">
            <div>
              <p className="text-lg font-semibold text-slate-900">${member.hourlyRate}</p>
              <p className="text-xs text-slate-600">Hourly Rate</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{new Date(member.startDate).getFullYear()}</p>
              <p className="text-xs text-slate-600">Start Year</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{member.maxJobs}</p>
              <p className="text-xs text-slate-600">Max Jobs</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AddMemberFormProps {
  onSave: (member: Omit<CrewMember, "id">) => void
  onCancel: () => void
}

function AddMemberForm({ onSave, onCancel }: AddMemberFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    initials: "",
    role: "",
    team: "team1" as const,
    hoursPerWeek: 40,
    phone: "",
    email: "",
    skills: [] as string[],
    certifications: [] as string[],
    availability: "available" as const,
    currentJobs: 0,
    maxJobs: 2,
    hourlyRate: 20,
    startDate: new Date().toISOString().split("T")[0],
    notes: "",
    emergencyContact: "",
    emergencyPhone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Initials</label>
          <Input
            value={formData.initials}
            onChange={(e) => setFormData((prev) => ({ ...prev, initials: e.target.value.toUpperCase() }))}
            maxLength={3}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Role</label>
          <Input
            value={formData.role}
            onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Team</label>
          <Select
            value={formData.team}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, team: value as any }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team1">Team 1</SelectItem>
              <SelectItem value="team2">Team 2</SelectItem>
              <SelectItem value="team3">Team 3</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Hours/Week</label>
          <Input
            type="number"
            value={formData.hoursPerWeek}
            onChange={(e) => setFormData((prev) => ({ ...prev, hoursPerWeek: Number.parseInt(e.target.value) || 0 }))}
            min="1"
            max="60"
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Max Jobs</label>
          <Input
            type="number"
            value={formData.maxJobs}
            onChange={(e) => setFormData((prev) => ({ ...prev, maxJobs: Number.parseInt(e.target.value) || 1 }))}
            min="1"
            max="10"
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Hourly Rate</label>
          <Input
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData((prev) => ({ ...prev, hourlyRate: Number.parseFloat(e.target.value) || 0 }))}
            min="15"
            step="0.50"
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          rows={2}
          className="mt-1"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-10">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 h-10 bg-emerald-500 hover:bg-emerald-600">
          Add Team Member
        </Button>
      </div>
    </form>
  )
}

import { notFound } from "next/navigation"
import { LeadDetailPage } from "@/components/lead-detail-page"

// Mock lead data - in real app this would come from database
const mockLeads = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "(555) 123-4567",
    email: "sarah.johnson@email.com",
    address: "123 Oak Street, Springfield",
    source: "Website Inquiry",
    services: ["Design", "Installation"],
    description: "Looking for front yard redesign with low-maintenance plants",
    timeAgo: "3 days ago",
    status: "contacted",
    priority: "high",
    lastContact: "2024-01-15T10:00:00Z",
    assignedTo: "Emma Thompson",
    budget: "$5,000 - $10,000",
    timeline: "Spring 2024",
    notes: "Customer mentioned they travel frequently and want low-maintenance options. Interested in native plants.",
    createdAt: "2024-01-12T09:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Mike Chen",
    phone: "(555) 234-5678",
    email: "mike.chen@email.com",
    address: "456 Maple Drive, Springfield",
    source: "Nursery Walk-in",
    services: ["Delivery", "Installation"],
    description: "Purchased 15 shrubs, needs delivery and planting this week",
    timeAgo: "4 days ago",
    status: "contacted",
    priority: "medium",
    lastContact: "2024-01-14T14:30:00Z",
    assignedTo: "David Wilson",
    budget: "$2,000 - $3,000",
    timeline: "This week",
    notes: "Already purchased plants from nursery. Just needs installation service.",
    createdAt: "2024-01-10T14:00:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
  },
  {
    id: "3",
    name: "Jennifer Martinez",
    phone: "(555) 345-6789",
    email: "jennifer.martinez@email.com",
    address: "789 Pine Road, Springfield",
    source: "Referral",
    services: ["Design", "Hardscape"],
    description: "Complete backyard renovation including patio and landscaping",
    timeAgo: "1 day ago",
    status: "new",
    priority: "high",
    budget: "$15,000 - $25,000",
    timeline: "Summer 2024",
    notes: "Referred by previous customer. Large project with hardscaping needs.",
    createdAt: "2024-01-17T11:00:00Z",
    updatedAt: "2024-01-17T11:00:00Z",
  },
  {
    id: "4",
    name: "Robert Wilson",
    phone: "(555) 456-7890",
    email: "robert.wilson@email.com",
    address: "321 Cedar Lane, Springfield",
    source: "Phone Inquiry",
    services: ["Design", "Installation"],
    description: "Interested in drought-resistant landscaping for large property",
    timeAgo: "2 hours ago",
    status: "assigned",
    assignedTo: "Emma Thompson",
    priority: "medium",
    lastContact: "2024-01-18T16:00:00Z",
    budget: "$8,000 - $12,000",
    timeline: "Fall 2024",
    notes: "Large property with water restrictions. Needs drought-tolerant design.",
    createdAt: "2024-01-18T14:00:00Z",
    updatedAt: "2024-01-18T16:00:00Z",
  },
  {
    id: "5",
    name: "Linda Davis",
    phone: "(555) 567-9012",
    email: "linda.davis@email.com",
    address: "987 Elm Court, Springfield",
    source: "Online Ad",
    services: ["Hardscape", "Installation"],
    description: "Needs a retaining wall and paver patio installed",
    timeAgo: "1 week ago",
    status: "consultation-needed",
    priority: "high",
    budget: "$10,000 - $15,000",
    timeline: "Spring 2024",
    notes: "Ready to move forward with consultation. Has specific design ideas.",
    createdAt: "2024-01-11T10:00:00Z",
    updatedAt: "2024-01-11T10:00:00Z",
  },
]

interface LeadDetailPageProps {
  params: {
    id: string
  }
}

export default function LeadDetailPageRoute({ params }: LeadDetailPageProps) {
  const lead = mockLeads.find((l) => l.id === params.id)

  if (!lead) {
    notFound()
  }

  return <LeadDetailPage lead={lead} />
}

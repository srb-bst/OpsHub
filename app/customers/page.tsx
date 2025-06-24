import { CustomerList } from "@/components/customer-list"

export default function CustomersPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <CustomerList />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Users, Trash2, CreditCard } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  studentId: string
  phone?: string
  fine: number
  createdAt: string
}

export default function MembersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        toast.error('Failed to fetch members')
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
      toast.error('Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Member deleted successfully!')
        fetchUsers()
      } else {
        toast.error('Failed to delete member')
      }
    } catch (err) {
      console.error('Delete member error:', err)
      toast.error('An error occurred while deleting member')
    }
  }

  const totalFines = users.reduce((sum, user) => sum + user.fine, 0).toFixed(2)
  const membersWithFines = users.filter(user => user.fine > 0).length

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-primary">Loading...</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-primary rounded-xl p-6">Library Members</h1>
          <p className="text-muted-foreground mt-4">An overview of all registered library members.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-sm hover:shadow-md border-none bg-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">Total Members</CardTitle>
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md border-none bg-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">Members with Fines</CardTitle>
              <div className="bg-destructive/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{membersWithFines}</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md border-none bg-card rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">Total Fines</CardTitle>
              <div className="bg-secondary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-secondary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary-foreground">₹{totalFines}</div>
            </CardContent>
          </Card>
        </div>

        {/* Member Details Table */}
        <Card className="border-none bg-card rounded-xl">
          <CardHeader>
            <CardTitle className="text-foreground">Member Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted text-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">NAME</th>
                    <th className="px-4 py-3 text-left">MEMBER ID</th>
                    <th className="px-4 py-3 text-left">EMAIL</th>
                    <th className="px-4 py-3 text-left">FINE</th>
                    <th className="px-4 py-3 text-left">JOINED</th>
                    <th className="px-4 py-3 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{user.studentId}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={user.fine > 0 ? 'destructive' : 'default'} className="bg-opacity-10">
                          ₹{user.fine.toFixed(2)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && !loading && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No members found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

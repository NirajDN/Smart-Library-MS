'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Book, User, IndianRupee, AlertCircle } from 'lucide-react'

interface BookIssue {
  id: string
  issueDate: string
  dueDate: string
  fine: number
  isOverdue: boolean
  daysOverdue: number
  overdueFine: number
  user: {
    id: string
    name: string
    studentId: string
    email: string
    fine: number
  }
  bookCopy: {
    id: string
    book: {
      id: string
      title: string
      author: string
      isbn: string
    }
  }
}

export default function IssueReports() {
  const [bookIssues, setBookIssues] = useState<BookIssue[]>([])

  useEffect(() => {
    fetchIssueReport()
  }, [])

  const fetchIssueReport = async () => {
    try {
      const response = await fetch('/api/reports/issue-report')
      if (response.ok) {
        const data = await response.json()
        setBookIssues(data.bookIssues)
      }
    } catch (error) {
      console.error('Failed to fetch issue report:', error)
    }
  }

  const totalFines = bookIssues.reduce((sum, issue) => sum + issue.overdueFine, 0)
  const overdueBooks = bookIssues.filter(issue => issue.isOverdue).length
  const activeUsers = new Set(bookIssues.map(issue => issue.user.id)).size

  const getStatusBadge = (issue: BookIssue) => {
    if (issue.isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>
    } else if (new Date(issue.dueDate) > new Date()) {
      const daysUntilDue = Math.ceil((new Date(issue.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntilDue <= 3) {
        return <Badge variant="secondary">Due Soon</Badge>
      } else {
        return <Badge variant="default">On Time</Badge>
      }
    }
    return <Badge variant="default">Renewed</Badge>
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-10">
          <h1 className="text-5xl font-bold text-foreground mb-3">Book Issue Reports</h1>
          <p className="text-muted-foreground text-lg">A comprehensive overview of all issued books and their current status.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'TOTAL ISSUES', value: bookIssues.length, icon: <Book className="h-6 w-6" />, color: 'bg-primary/10' },
            { title: 'OVERDUE BOOKS', value: overdueBooks, icon: <AlertCircle className="h-6 w-6 text-destructive" />, color: 'bg-destructive/10' },
            { title: 'PENDING FINES', value: `₹${totalFines.toFixed(2)}`, icon: <IndianRupee className="h-6 w-6 text-secondary-foreground" />, color: 'bg-secondary/10' },
            { title: 'ACTIVE USERS', value: activeUsers, icon: <User className="h-6 w-6 text-primary" />, color: 'bg-primary/10' },
          ].map(({ title, value, icon, color }) => (
            <Card key={title} className="shadow-none border-none">
              <CardContent className={`p-6 ${color} rounded-lg`}>
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground">{icon}</div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">{title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="shadow-lg border-none bg-card">
          <CardHeader className="border-b border-border pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Book Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {bookIssues.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="text-left p-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Book Details</th>
                      <th className="text-left p-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="text-left p-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Borrower</th>
                      <th className="text-left p-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Issue Date</th>
                      <th className="text-left p-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookIssues.map((issue) => {
                      const dueDate = new Date(issue.dueDate)
                      const issuedDate = new Date(issue.issueDate)
                      const book = issue.bookCopy.book

                      return (
                        <tr key={issue.id} className="border-b border-border hover:bg-muted/50 transition">
                          <td className="p-6">
                            <div>
                              <h4 className="font-bold text-foreground">{book.title}</h4>
                              <p className="text-sm text-muted-foreground">by {book.author}</p>
                              <p className="text-xs text-muted-foreground">ISBN: {book.isbn}</p>
                            </div>
                          </td>
                          <td className="p-6">
                            {getStatusBadge(issue)}
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                                {issue.user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{issue.user.name}</p>
                                <p className="text-sm text-muted-foreground">ID: {issue.user.studentId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <p className="text-sm text-foreground">{issuedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          </td>
                          <td className="p-6">
                            <p className={`text-sm font-medium ${issue.isOverdue ? 'text-destructive' : 'text-secondary-foreground'}`}>
                              {dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                            {issue.isOverdue && (
                              <p className="text-xs text-destructive mt-1">{issue.daysOverdue} days overdue</p>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No books currently issued.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Issue New Book Button */}

      </div>
    </main>
  )
}
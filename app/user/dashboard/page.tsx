'use client'

import { BookSearch } from '@/components/books/book-search'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Book, Clock, IndianRupee } from 'lucide-react'
import { useState, useEffect } from 'react'

interface BookIssue {
  id: string
  issueDate: string
  dueDate: string
  fine: number
  bookCopy: {
    book: {
      id: string
      title: string
      author: string
      isbn: string
    }
  }
}

interface RecommendationItem {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  description?: string | null
  available: number
  quantity: number
  reason: string
}

export default function UserDashboard() {
  const [bookIssues, setBookIssues] = useState<BookIssue[]>([])
  const [user, setUser] = useState<{ fine: number } | null>(null)
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])

  useEffect(() => {
    fetchMyBooks()
    fetchUser()
    fetchRecommendations()
  }, [])

  const fetchMyBooks = async () => {
    try {
      const response = await fetch('/api/users/my-books')
      if (response.ok) {
        const data = await response.json()
        setBookIssues(data.bookIssues)
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    }
  }

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/users/recommendations')
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your updated library summary.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-md hover:-translate-y-3 border-l-primary border-4 hover:shadow-lg transition-all duration-300 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-large text-foreground">
                Books Issued
              </CardTitle>
              <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
                <Book className="h-4 w-4 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-primary">
                {bookIssues.length}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-3 border-l-destructive border-4 shadow-md hover:shadow-lg transition-all duration-300 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-large text-foreground">
                Overdue Books
              </CardTitle>
              <div className="h-8 w-8 bg-destructive rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-destructive-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-destructive">
                {bookIssues.filter(
                  (issue) => new Date(issue.dueDate) < new Date()
                ).length}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:-translate-y-3 border-l-orange-400 border-4 shadow-md hover:shadow-lg transition-all duration-300 bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-large text-foreground">
                Total Fine
              </CardTitle>
              <div className="h-8 w-8 bg-orange-400 rounded-full flex items-center justify-center">
                <IndianRupee className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-orange-400">
                ₹{user?.fine || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Currently Issued Books */}
        <Card className="shadow-md mb-12 bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Currently Issued Books
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Books you have currently borrowed from the library.
              </CardDescription>
            </div>
            <a
              href="#"
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All →
            </a>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookIssues.length > 0 ? (
              bookIssues.map((issue) => {
                const dueDate = new Date(issue.dueDate)
                const isOverdue = dueDate < new Date()
                const book = issue.bookCopy.book

                return (
                  <div
                    key={issue.id}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border transition-all ${
                      isOverdue
                        ? 'border-destructive bg-destructive/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex-1 min-w-0 mb-2 md:mb-0">
                      <h4 className="font-bold text-primary break-words">
                        {book.title}
                      </h4>
                      <p className="text-sm text-muted-foreground break-words">
                        by {book.author}
                      </p>
                      <p className="text-xs text-muted-foreground break-words">
                        ISBN: {book.isbn}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          isOverdue ? 'text-destructive' : 'text-foreground'
                        }`}
                      >
                        Due: {dueDate.toLocaleDateString()}
                      </p>
                      {isOverdue && (
                        <p className="text-xs font-semibold text-destructive">
                          Overdue!
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-muted-foreground">
                You currently have no books issued.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="shadow-md mb-12">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-zinc-800">
                Recommended For You
              </CardTitle>
              <CardDescription className="text-gray-600">
                Suggestions based on your borrowing history.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-indigo-800">{rec.title}</CardTitle>
                      <CardDescription>by {rec.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Book className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">ISBN: {rec.isbn}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5">
                            {rec.category}
                          </span>
                        </div>
                        {rec.description && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center rounded bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5">
                              {rec.description}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-600 italic">{rec.reason}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recommendations yet. Borrow some books to get suggestions.</p>
            )}
          </CardContent>
        </Card>

        {/* Book Search */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Library Books
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Search and explore all available books.
            </CardDescription>
          </CardHeader>
          <CardContent className="break-words whitespace-normal max-w-full">
            <BookSearch />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

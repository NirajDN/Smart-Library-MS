'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Book} from 'lucide-react'
import Image from 'next/image'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  description?: string
  imageUrl?: string
  available: number
  quantity: number
}

export function BookSearch() {
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/books?search=${search}`)
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books)
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search books by title, author, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">{book.title}</CardTitle>
              <CardDescription className="text-muted-foreground">by {book.author}</CardDescription>
            </CardHeader>
            {book.imageUrl && (
              <div className="px-6 pb-4">
                <Image
                  src={book.imageUrl}
                  alt={`${book.title} cover`}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Book className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">ISBN: {book.isbn}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="break-words whitespace-normal max-w-full">{book.category}</Badge>
                  {book.description && (
                    <Badge variant="secondary" className="break-words whitespace-normal max-w-full">{book.description}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-8">
          <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No books found</p>
        </div>
      )}
    </div>
  )
}
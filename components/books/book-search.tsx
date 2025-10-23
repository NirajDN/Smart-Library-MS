'use client'

import { useState, useEffect, useCallback } from 'react'
import type { FC, InputHTMLAttributes, ReactNode } from 'react'
import Image from 'next/image'

/* Minimal local UI components */
const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    {...props}
    className={`border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent rounded-xl px-4 py-2.5 w-full shadow-sm bg-white/70 backdrop-blur-md transition-all duration-200 ${className ?? ''}`}
  />
)

const Card: FC<{ className?: string; children?: ReactNode }> = ({ className, children }) => (
  <div className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 ${className ?? ''}`}>
    {children}
  </div>
)

const CardHeader: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-2xl">
    {children}
  </div>
)

const CardTitle: FC<{ className?: string; children?: ReactNode }> = ({ className, children }) => (
  <h3 className={`text-lg font-semibold text-gray-800 ${className ?? ''}`}>{children}</h3>
)

const CardDescription: FC<{ children?: ReactNode }> = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
)

const CardContent: FC<{ children?: ReactNode }> = ({ children }) => (
  <div className="px-5 py-4">{children}</div>
)

const Badge: FC<{ className?: string; children?: ReactNode }> = ({ className, children }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 ${className ?? ''}`}>
    {children}
  </span>
)

/* Simple emoji icons */
const Search: FC<{ className?: string }> = ({ className }) => <span className={className} aria-hidden>🔍</span>
const Book: FC<{ className?: string }> = ({ className }) => <span className={className} aria-hidden>📖</span>

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
    <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Title and Search */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Explore Our Library
          </h1>
          <p className="text-gray-500 mb-6">
            Search and discover books by title, author, or category
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-gray-700"
            />
          </div>
        </div>

        {/* Book Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">Loading books...</div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card key={book.id}>
                <CardHeader>
                  <CardTitle>{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </CardHeader>

                {book.imageUrl && (
                  <div className="px-5 pt-4">
                    <Image
                      src={book.imageUrl}
                      alt={`${book.title} cover`}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-xl shadow-sm transition-transform duration-300 hover:scale-[1.03]"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                )}

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Book /> ISBN: {book.isbn}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{book.category}</Badge>
                      {book.description && (
                        <Badge className="bg-purple-50 text-purple-700">{book.description}</Badge>
                      )}
                    </div>
                    <div className="pt-2">
                      <Badge className={`text-white ${book.available > 0 ? 'bg-green-500' : 'bg-red-400'}`}>
                        {book.available > 0 ? `${book.available} Available` : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Book className="text-5xl text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No books found. Try searching for another title.</p>
          </div>
        )}
      </div>
    </div>
  )
}

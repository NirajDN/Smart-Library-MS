'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Search, Trash2, Book } from 'lucide-react'
import Image from 'next/image'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  description?: string
  imageUrl?: string
  quantity: number
  available: number
  copies: {
    id: string
    status: string
  }[]
}

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    imageUrl: '',
    quantity: 1,
  })

  const fetchBooks = useCallback(async () => {
    try {
      const response = await fetch(`/api/books?search=${search}`)
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books)
      }
      } catch (err) {
        console.error('Failed to fetch books:', err)
    }
  }, [search])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Book added successfully!')
        setShowAddDialog(false)
        setBookForm({
          title: '',
          author: '',
          isbn: '',
          category: '',
          description: '',
          imageUrl: '',
          quantity: 1,
        })
        fetchBooks()
      } else {
        toast.error(data.error || 'Failed to add book')
      }
    } catch (err) {
      console.error('Add book error:', err)
      toast.error('An error occurred while adding book')
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Book deleted successfully!')
        fetchBooks()
      } else {
        toast.error('Failed to delete book')
      }
    } catch (err) {
      console.error('Delete book error:', err)
      toast.error('An error occurred while deleting book')
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-1">Books Management</h1>
            <p className="text-muted-foreground">Add, search, and manage your library collection</p>
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>
                  Enter book details below to add it to the library
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBook} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={bookForm.title}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={bookForm.author}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, author: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={bookForm.isbn}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, isbn: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={bookForm.category}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, category: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={bookForm.description}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/book-image.jpg"
                    value={bookForm.imageUrl}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, imageUrl: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">Paste the image URL from Amazon or other book websites</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={bookForm.quantity === 0 ? "" : bookForm.quantity}
                    onChange={(e) =>
                      setBookForm({
                        ...bookForm,
                        quantity: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
                      })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                >
                  Add Book
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      by {book.author}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBook(book.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">ISBN: {book.isbn}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs break-words whitespace-normal max-w-full">
                    {book.category}
                  </Badge>
                  <Badge
                    variant={book.available > 0 ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {book.available}/{book.quantity} Available
                  </Badge>
                </div>
                {book.description && (
                  <p className="text-sm text-muted-foreground">{book.description}</p>
                )}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Available Copy IDs:</p>
                  <div className="flex flex-wrap gap-1">
                    {book.copies
                      .filter(copy => copy.status === 'AVAILABLE')
                      .map((copy) => (
                        <span
                          key={copy.id}
                          className="text-xs bg-muted text-foreground px-2 py-1 rounded border"
                        >
                          {copy.id}
                        </span>
                      ))
                    }
                    {book.copies.filter(copy => copy.status === 'AVAILABLE').length === 0 && (
                      <span className="text-xs text-muted-foreground italic">No copies available</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No books found</p>
          </div>
        )}
      </div>
    </main>
  )
}

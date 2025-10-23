'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { QrCode, Download } from 'lucide-react'
import Image from 'next/image'

interface Book {
  id: string
  title: string
  author: string
}

interface User {
  id: string
  name: string
  studentId: string
}

export default function QRGenerator() {
  const [books, setBooks] = useState<Book[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [qrType, setQrType] = useState<'book' | 'user'>('book')
  const [selectedId, setSelectedId] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBooks()
    fetchUsers()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books/bookCopy')
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books)
      }
    } catch (err) {
      console.error('Failed to fetch books:', err)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  const generateQRCode = async () => {
    if (!selectedId) {
      toast.error('Please select an item to generate QR code for')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: qrType, id: selectedId })
      })

      const data = await response.json()

      if (response.ok) {
        setQrCodeUrl(data.qrCodeUrl)
        toast.success('QR code generated successfully!')
      } else {
        toast.error(data.error || 'Failed to generate QR code')
      }
    } catch (err) {
      console.error('QR generation error:', err)
      toast.error('An error occurred while generating QR code')
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `${qrType}-${selectedId}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetForm = () => {
    setSelectedId('')
    setQrCodeUrl('')
  }

  useEffect(() => {
    resetForm()
  }, [qrType])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">QR Code Generator</h1>
          <p className="text-muted-foreground">Generate QR codes for books and users</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle>Generate QR Code</CardTitle>
              <CardDescription>Create QR codes for quick scanning operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="type">QR Code Type</Label>
                <Select value={qrType} onValueChange={(value: 'book' | 'user') => setQrType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {qrType === 'book' ? (
                <div>
                  <Label htmlFor="book">Select Book</Label>
                  <Select value={selectedId} onValueChange={setSelectedId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {books.map((book) => (
                        <SelectItem key={book.id} value={book.id}>
                          {book.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label htmlFor="user">Select User</Label>
                  <Select value={selectedId} onValueChange={setSelectedId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.studentId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button onClick={generateQRCode} disabled={loading || !selectedId} className="w-full">
                {loading ? 'Generating...' : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          <Card>
            <CardHeader>
              <CardTitle>Generated QR Code</CardTitle>
              <CardDescription>
                {qrCodeUrl ? 'QR code ready for download' : 'QR code will appear here'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qrCodeUrl ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="border rounded-lg p-4 bg-card inline-block">
                      <Image src={qrCodeUrl} alt="Generated QR Code" width={256} height={256} />
                    </div>
                  </div>
                  <Button onClick={downloadQRCode} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Generate a QR code to see it here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Usage Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Book QR Codes</h4>
                <p className="text-sm text-muted-foreground">
                  Use book QR codes for quick issue and return operations. These can be printed and attached to books.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">User QR Codes</h4>
                <p className="text-sm text-muted-foreground">
                  User QR codes can be printed on student ID cards for quick identification during book issues.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Quick Operations</h4>
                <p className="text-sm text-muted-foreground">
                  For quick issue: First scan user QR, then scan book QR. For quick return: Scan book QR only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label' 

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Invalid credentials')

      const data = await res.json()
      startTransition(() => {
        router.push(data.user.role === 'USER' ? '/user/dashboard' : '/librarian/dashboard')
      })
    
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white border border-neutral-200 rounded-2xl p-12 shadow-xl space-y-8"
      >
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-neutral-600">
            Log in to your LibraryMS account
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 h-12"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 h-12"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all h-12 text-base"
          disabled={isPending}
        >
          {isPending ? 'Logging in…' : 'Log In'}
        </Button>

        <p className="text-center text-sm text-neutral-500">
          Don’t have an account?{' '}
          <Link
            href="/auth/register"
            className="text-blue-600 underline"
          >
            Register
          </Link>
        </p>
      </form>
    </main>
  )
}

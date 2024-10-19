'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup, setAuthToken } from '@/src/lib/api'
import { FileText, Mail, Lock, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await signup(name, email, password)
      setAuthToken(data.token)
      router.push('/dashboard')
    } catch (err) {
      setError('Signup failed. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center p-4 bg-cover bg-center bg-[url('https://img.freepik.com/premium-photo/pieces-torn-paper-texture-background-with-copy-space-text_34155-3976.jpg')] h-screen w-full">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl"
      >
        <div className="w-full md:w-1/2 p-8">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h2>
            <p className="text-gray-600 mb-6">Start your note-taking journey</p>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="pl-10 w-full bg-white text-black border-black border-2"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email-address" className="text-sm font-medium text-gray-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 w-full bg-white text-black border-black border-2"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="pl-10 w-full bg-white text-black border-black border-2"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              Sign up
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-amber-600 hover:text-amber-500">
              Log in
            </Link>
          </p>
        </div>
        <div className="w-full md:w-1/2 bg-amber-100 rounded-r-2xl overflow-hidden relative">
          <img 
            className="object-cover w-full h-full"
            src="https://img1.wallspic.com/crops/6/3/7/0/7/170736/170736-orange-brown-natural_environment-amber-material_property-6016x3614.png?height=1080&width=1920" 
            alt="Note-taking illustration" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-center text-black">
              <FileText className="mx-auto h-16 w-16 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Note-Canvas</h3>
              <p className="text-sm font-semibold">Capture your thoughts, organize your life</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

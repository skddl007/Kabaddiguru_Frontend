"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/UserContext"
import { Mail, Lock, User as UserIcon, Loader2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AuthModal({ isOpen, onClose, defaultMode = "signin" }) {
  const [mode, setMode] = useState(defaultMode) // "signin" or "signup"
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [showForgot, setShowForgot] = useState(false)
  const [resetStage, setResetStage] = useState('request') // 'request' | 'confirm'
  const [resetEmail, setResetEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  
  const { toast } = useToast()
  const { login } = useUser()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (mode === "signup" && (!formData.name || !formData.email || !formData.password)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }
    if (mode === "signin" && (!formData.email || !formData.password)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/signin"
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(mode === "signup" && { full_name: formData.name })
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Backend returns user data directly, not nested under 'user' key
        login(data, data.token)
        toast({
          title: "Success!",
          description: mode === "signup" ? "Account created successfully!" : "Welcome back!",
        })
        handleClose()
      } else {
        toast({
          title: "Error",
          description: data.detail || `Failed to ${mode}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Error during ${mode}:`, error)
      toast({
        title: "Error",
        description: `Failed to ${mode}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!resetEmail) {
      toast({ title: "Email required", description: "Please enter your email.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail })
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setResetStage('confirm')
        if (data.reset_token) {
          setResetToken(data.reset_token)
        }
        toast({ title: "Email sent", description: "If the email exists, a reset link has been sent." })
      } else {
        toast({ title: "Error", description: data.detail || "Failed to request reset.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to request reset.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!resetEmail || !resetToken || !newPassword) {
      toast({ title: "Missing information", description: "Email, token and new password are required.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, reset_token: resetToken, new_password: newPassword })
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        toast({ title: "Password updated", description: "You can now sign in with your new password." })
        // prefill sign-in form
        setFormData(prev => ({ ...prev, email: resetEmail, password: newPassword }))
        setShowForgot(false)
        setResetStage('request')
        setResetToken("")
        setNewPassword("")
      } else {
        toast({ title: "Error", description: data.detail || "Failed to reset password.", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to reset password.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setMode(defaultMode)
    setFormData({ name: "", email: "", password: "" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode === "signup" ? "Create Account" : "Sign In"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "signup" ? "Create your account to get started with KabaddiGuru" : "Sign in to your account"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {mode === "signin" && !showForgot && (
            <div className="text-right -mt-2">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-xs text-orange-600 hover:text-orange-700"
              >
                Forgot password?
              </button>
            </div>
          )}

          {mode === "signin" && showForgot && (
            <div className="p-3 border rounded-md bg-orange-50/50 space-y-3">
              {resetStage === 'request' ? (
                <>
                  <Label className="text-xs">Email</Label>
                  <Input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowForgot(false)}>Cancel</Button>
                    <Button type="button" size="sm" onClick={handleForgotPassword} disabled={loading}>Send reset link</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label className="text-xs">Email</Label>
                    <Input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                    <Label className="text-xs">Reset Token</Label>
                    <Input type="text" value={resetToken} onChange={(e) => setResetToken(e.target.value)} />
                    <Label className="text-xs">New Password</Label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => { setShowForgot(false); setResetStage('request') }}>Cancel</Button>
                    <Button type="button" size="sm" onClick={handleResetPassword} disabled={loading}>Reset Password</Button>
                  </div>
                </>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "signup" ? "Creating Account..." : "Signing In..."}
              </>
            ) : (
              mode === "signup" ? "Create Account" : "Sign In"
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                className="ml-1 text-orange-600 hover:text-orange-700 font-medium"
              >
                {mode === "signup" ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

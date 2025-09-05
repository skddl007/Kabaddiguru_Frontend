"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Shield, Users, X } from "lucide-react"

export default function SubscriptionModal({ isOpen, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "$9.99",
      period: "month",
      features: [
        "100 chat requests per month",
        "Basic analytics",
        "Email support",
        "Standard response time"
      ],
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19.99",
      period: "month",
      features: [
        "Unlimited chat requests",
        "Advanced analytics",
        "Priority support",
        "Faster response time",
        "Custom insights",
        "Team collaboration"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$49.99",
      period: "month",
      features: [
        "Everything in Pro",
        "Custom integrations",
        "Dedicated support",
        "API access",
        "White-label options",
        "Advanced security"
      ],
      popular: false
    }
  ]

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      // Here you would integrate with your payment processor
      // For now, we'll just simulate a successful subscription
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Close modal and show success message
      onClose()
      // You can add a toast notification here
    } catch (error) {
      console.error("Subscription error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-center flex-1">
              Upgrade Your Experience
            </DialogTitle>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogDescription className="text-center">
            You&apos;ve reached your free chat limit. Upgrade to continue enjoying unlimited access to KabaddiGuru.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-orange-500 border-orange-200' 
                  : 'border-gray-200'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500">
                  <Crown className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full mt-6 ${
                    selectedPlan === plan.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={handleSubscribe}
                  disabled={loading}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    selectedPlan === plan.id ? "Subscribe Now" : "Select Plan"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-gray-900">Secure & Flexible</span>
          </div>
          <p className="text-sm text-gray-600">
            All plans include secure payment processing, 30-day money-back guarantee, 
            and the ability to cancel anytime. No long-term commitments required.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

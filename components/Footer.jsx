"use client"

import Link from "next/link"
import { Bot } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center space-x-2 justify-center sm:justify-start">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/KabaddiGuru Logo.jpeg" 
                  alt="KabaddiGuru Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold">KabaddiGuru</span>
            </div>
            <p className="text-gray-400 text-sm">
              Intelligent sports analytics platform for Kabaddi teams and analysts.
            </p>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/chat" className="hover:text-white">Chat Interface</Link></li>
              <li><Link href="/analytics" className="hover:text-white">Analytics Tool</Link></li>
              {/* <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li> */}
              {/* <li><Link href="/upload" className="hover:text-white">Data Upload</Link></li> */}
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>AI Analytics</li>
              <li>Performance Tracking</li>
              <li>Team Insights</li>
              <li>Match Analysis</li>
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Support</Link></li>
              <li>Documentation</li>
              <li>API Reference</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 KabaddiGuru. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

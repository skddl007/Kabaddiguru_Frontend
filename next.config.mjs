import fs from 'fs'
import { config as dotenvConfig } from 'dotenv'

// Load envs for both dev and build phases
if (fs.existsSync('./config.env')) {
  dotenvConfig({ path: './config.env' })
}
if (fs.existsSync('./.env.local')) {
  dotenvConfig({ path: './.env.local' })
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  env: {
    // Expose environment variables to the client
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_URL_ALT: process.env.NEXT_PUBLIC_API_URL_ALT,
    NEXT_PUBLIC_API_URL_ALT2: process.env.NEXT_PUBLIC_API_URL_ALT2,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
  },
}

export default nextConfig

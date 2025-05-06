'use client'

import { useEffect, useState } from 'react'

export default function EnvChecker() {
  const [envStatus, setEnvStatus] = useState({})
  
  useEffect(() => {
    const vars = [
      'GOOGLE_ID',
      'GOOGLE_SECRET',
      'JWT_SECRET',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ]
    
    const status = {}
    vars.forEach(v => {
      status[v] = process.env.NEXT_PUBLIC_DEBUG === 'true' 
        ? process.env[v] || 'missing'
        : process.env[v] ? 'set' : 'missing'
    })
    
    setEnvStatus(status)
    console.log('Environment variables status:', status)
  }, [])
  
  return null
} 
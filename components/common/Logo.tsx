import Link from 'next/link'
import React from 'react'
import logo from "@/public/Logo.png"
import Image from 'next/image'
import { cn } from '@/lib/utils'

const Logo = () => {
  return (
    <Link href="/" className='w-22'>
        <Image src={logo} alt="WebLogo" className={cn("w-22")} priority />
    </Link>
  )
}

export default Logo
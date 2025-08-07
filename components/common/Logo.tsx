import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  headerLogo?: string;
}

const Logo: React.FC<LogoProps> = ({ headerLogo }) => {
  const logoSrc = headerLogo || "/Logo.png";
  console.log("Logo src:", logoSrc);
  return (
    <Link href="/" className='w-22'>
        <Image src={logoSrc} alt="WebLogo" className={cn("w-22")} priority width={88} height={32} />
    </Link>
  )
}

export default Logo
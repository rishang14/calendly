import React from 'react' 
import Link from 'next/link'
import Image from 'next/image' 
import Logo from "@/public/logo.png"
import AuthDialog from './authDialog'

const Navbar = () => {
  return (
    <div className='flex items-center py-5  justify-between'>
     <Link href={"/"} className='flex items-center gap-2'> 
      <Image src={Logo} alt='logo' className='size-10'/> 
       <h2 className='text-3xl font-semibold text-blue-400/80'>Calendly</h2>
     </Link>

      <AuthDialog/>
    </div>
  )
}

export default Navbar
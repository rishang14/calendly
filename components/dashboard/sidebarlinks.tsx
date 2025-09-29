"use client"
import { cn } from '@/lib/utils'
import { Settings,CalendarCheck ,Users2,HomeIcon} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react' 

type  linkprops={
    id:number, 
    name:string, 
    href:string, 
    icon:any
} 


export const SideBarItems:linkprops[]=[
 {
    id: 0,
    name: "Event Types",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Meetings",
    href: "/dashboard/meetings",
    icon: Users2,
  },
  {
    id: 2,
    name: "Availablity",
    href: "/dashboard/availability",
    icon: CalendarCheck,
  },
  {
    id: 3,
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },

]

const Sidebarlinks = () => { 
    const pathname=usePathname();
  return (
   <>
   {SideBarItems.map((link) => (
        <Link
          className={cn(
            pathname === link.href
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground",
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
          )}
          key={link.id}
          href={link.href}
        >
          <link.icon className="size-4" />
          {link.name}
        </Link>
      ))}
   </>
  )
}

export default Sidebarlinks
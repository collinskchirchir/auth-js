'use client'
import { FaRegUser } from "react-icons/fa6";
import { ExitIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from '@/hooks/use-current-user';
import { LogoutButton } from '@/components/logout-button';

export const UserButton = () => {
  const user = useCurrentUser();
  return (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Avatar>
        <AvatarImage src={user?.image || ''}/>
        <AvatarFallback className='bg-sky-500'>
          <FaRegUser className="text-white" />
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className='w-40' align='end'>
      <LogoutButton>
        <DropdownMenuItem>
          <ExitIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </LogoutButton>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}
'use client'

import type { FC } from 'react'
import type { NavUserMenu as Props } from '@/shared/constants'
import { logoutUser } from '@/entities/user'
import Image from 'next/image'
import Link from 'next/link'

export const UserMenuItem: FC<Props> = ({ src, alt, href }) => {
    const Component = () => {
        return (
            <div className='bg-slate-100 rounded-full p-3 hover:bg-slate-200 transition'>
                <Image
                    src={src}
                    alt={alt}
                    width={24}
                    height={24}
                />
            </div>
        )
    }

    return href ? (
        <Link href={href}>
            <Component />
        </Link>
    ) : (
        <button onClick={logoutUser}>
            <Component />
        </button>
    )
}

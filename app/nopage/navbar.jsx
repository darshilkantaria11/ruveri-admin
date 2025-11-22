"use client"
import Image from 'next/image';
import Logo from "../../public/logo.png"
import Link from 'next/link';
import { useState } from 'react';


export default function Navbar() {


    


    return (
        <>
            <div className="flex justify-between items-center px-4 py-2 bg-b2 lv">
                {/* Left side: Logo */}
                <Link href="/">
                    <div className="flex items-center">
                        <Image
                            src={Logo}// Replace with your logo path
                            alt="Logo"
                            width={50} // Adjust the width as needed
                            height={50} // Adjust the height as needed
                        />
                    </div>
                </Link>

                {/* Right side: Book a Tour button */}
                <div className='flex flex-row'>
                    <Link href="/dashboard" className="bg-b3 px-6 py-2 rounded-full">
                       Dashboard
                    </Link>
                   
                </div>

            </div>
          
        </>
    );
}

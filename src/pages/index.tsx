import { Inter } from "next/font/google";
import AlkolFiyatlari from "@/pages/AlkolFiyatlari";
import React from "react";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <main className={`relative flex flex-col items-center justify-center min-h-screen p-2 sm:p-24 ${inter.className}`}>
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <Image
                    className="absolute   object-cover w-full h-full"
                    src="/arkaplan.jpg"
                    alt="Background Image"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
                <div className="flex relative flex-col mx-auto  mb-auto">
                    <AlkolFiyatlari />


                </div>
            </div>


        </main>
    );
}

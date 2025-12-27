"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
   

    const cardClasses =
        "flex flex-col justify-center items-center text-center group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 hover:scale-105 min-h-[250px]";

    return (
        <div className="min-h-screen bg-b3 p-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-b1 mb-2">Ruveri Jewel</h1>
                <p className="text-xl text-black">Admin Product Dashboard</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <Link href="/product1">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2  transition-colors">
                            Bangles
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Bangles</p>

                    </div>
                </Link>
                <Link href="/product2">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2  transition-colors">
                            Bracelets
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Bracelets</p>

                    </div>
                </Link>
                <Link href="/product3">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2  transition-colors">
                            Chains
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Chains</p>

                    </div>
                </Link>
                <Link href="/product4">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2  transition-colors">
                            Earrings
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Earrings</p>

                    </div>
                </Link>
                <Link href="/product5">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2  transition-colors">
                           Necklace
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Necklace</p>

                    </div>
                </Link>
                <Link href="/product6">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2  transition-colors">
                            Men Collections
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Men Collections </p>

                    </div>
                </Link>
                 <Link href="/product7">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2  transition-colors">
                            Pendants
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Pendants</p>

                    </div>
                </Link>
                  <Link href="/product8">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2  transition-colors">
                            Rings
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Rings</p>

                    </div>
                </Link>
                <Link href="/products">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2  transition-colors">
                            All Products
                        </h2>
                        <p className="text-gray-600 mb-4">View and Manage All Products</p>

                    </div>
                </Link>
                 {/* <Link href="/chainupdate">
                    <div className="flex flex-col justify-center items-center text-center group bg-green-200 p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 hover:scale-105 min-h-[250px]">
                        <h2 className="text-3xl font-bold text-b1 mb-2  transition-colors">
                            Chain Update
                        </h2>
                        <p className="text-gray-600 mb-4">update all chains for single and couple name neckalce</p>

                    </div>
                </Link> */}
            </div>
        </div>
    );
}

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
                <p className="text-xl text-black">Admin Order Dashboard</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <Link href="/orders">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2 group-hover:text-g4 transition-colors">
                            View Orders
                        </h2>
                        <p className="text-gray-600 mb-4">View orders and put into Crafting</p>

                    </div>
                </Link>
                <Link href="/orders2">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2 group-hover:text-g4 transition-colors">
                            Crafting Orders
                        </h2>
                        <p className="text-gray-600 mb-4">Orders into crafting</p>

                    </div>
                </Link>
                <Link href="/orders3">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2 group-hover:text-g4 transition-colors">
                            Shipped Orders
                        </h2>
                        <p className="text-gray-600 mb-4">Orders into Shipping</p>

                    </div>
                </Link>
                <Link href="/allorders">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-b1 mb-2 group-hover:text-g4 transition-colors">
                            All Orders
                        </h2>
                        <p className="text-gray-600 mb-4">View All Orders</p>

                    </div>
                </Link>
            </div>
        </div>
    );
}

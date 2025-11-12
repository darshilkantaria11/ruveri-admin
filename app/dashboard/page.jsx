"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== "admin-token") {
      router.push("/");
    }
  }, [router]);

  const cardClasses =
    "flex flex-col justify-center items-center text-center group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 hover:scale-105 min-h-[250px]";

  return (
    <div className="min-h-screen bg-b3 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-b1 mb-2">Ruveri Jewel</h1>
        <p className="text-xl text-b1">Admin Dashboard</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Link href="/addproducts">
          <div className={cardClasses}>
            <h2 className="text-3xl font-bold text-b1 mb-2 group-hover:text-b1 transition-colors">
              Add Products
            </h2>
            <p className="text-gray-600 mb-4">Manage and add new products</p>
            <div className="text-6xl text-b1 group-hover:text-b1 transition-colors">+</div>
          </div>
        </Link>

        <Link href="/manageorders">
          <div className={cardClasses}>
            <h2 className="text-3xl font-bold text-b1 mb-2 group-hover:text-b1 transition-colors">
              Orders
            </h2>
            <p className="text-gray-600">
              Manage the Orders
            </p>
            
          </div>
        </Link>
         {/* <Link href="/abandonedcart">
          <div className={cardClasses}>
            <h2 className="text-3xl font-bold text-b1 mb-2 group-hover:text-g4 transition-colors">
              Abandoned carts
            </h2>
            <p className="text-gray-600">
              Call the customers for follow up
            </p>
          </div>
        </Link> */}
      </div>
    </div>
  );
}

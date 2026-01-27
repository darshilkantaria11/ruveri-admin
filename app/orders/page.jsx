"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [productDetailsMap, setProductDetailsMap] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/order");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        groupOrdersById(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }

  function groupOrdersById(allOrders) {
    const grouped = {};

    allOrders.forEach((order) => {
      order.items.forEach((item) => {
        // Filter only Confirmed orders
        if (item.orderStatus !== "Confirmed") return;

        if (!grouped[item.orderId]) {
          grouped[item.orderId] = {
            orderId: item.orderId,
            createdAt: item.createdAt,
            method: item.method,
            orderStatus: item.orderStatus,
            amount: item.amount, // This is the purchased amount
            user: {
              name: order.name,
              email: order.email
            },
            items: [],
          };
        }

        // Add item to the group
        grouped[item.orderId].items.push({
          ...item,
          userName: order.name,
          userEmail: order.email,
        });
      });
    });

    setGroupedOrders(grouped);
  }

  const fetchAllProductDetails = async (items) => {
    const detailsMap = {};
    for (const item of items) {
      const pid = item.productId;
      if (!detailsMap[pid]) {
        try {
          const res = await fetch(`/api/fetch/${pid}`, {
            headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
          });
          const product = await res.json();
          detailsMap[pid] = product;
        } catch (err) {
          console.error(`Failed to fetch product ${pid}`, err);
        }
      }
    }
    setProductDetailsMap(detailsMap);
  };

  const handleViewDetails = async (orderId) => {
    const orderGroup = groupedOrders[orderId];
    if (!orderGroup) return;

    await fetchAllProductDetails(orderGroup.items);
    setSelectedOrderId(orderId);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch("/api/order/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Order status updated successfully");
        fetchOrders();
      } else {
        alert(result.error || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error occurred while updating status");
    }
  };

  // Calculate total order amount
  const calculateOrderTotal = (orderGroup) => {
    return orderGroup.items.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
        Confirmed Orders Dashboard
      </h1>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Order ID",
                "Date & Time",
                "Total Amount",
                "Payment Method",
                "Status",
                "Actions",
                "View Details",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.values(groupedOrders).length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-400 font-semibold"
                >
                  No Confirmed Orders Found
                </td>
              </tr>
            )}
            {Object.values(groupedOrders)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((orderGroup) => (
                <tr
                  key={orderGroup.orderId}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-mono text-sm max-w-[120px] truncate">
                    {orderGroup.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {format(new Date(orderGroup.createdAt), "dd MMM yyyy, HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                    ₹{calculateOrderTotal(orderGroup).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 uppercase font-medium">
                    {orderGroup.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      {orderGroup.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() =>
                        updateOrderStatus(orderGroup.orderId, "Processing")
                      }
                      className="inline-flex items-center px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                    >
                      Processing
                    </button>
                    <button
                      onClick={() =>
                        updateOrderStatus(orderGroup.orderId, "Cancelled")
                      }
                      className="inline-flex items-center px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition"
                    >
                      Cancel
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(orderGroup.orderId)}
                      className="inline-flex items-center px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Popup */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setSelectedOrderId(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold"
              aria-label="Close details"
            >
              &times;
            </button>

            <h3 className="text-2xl font-semibold mb-6 border-b pb-2">
              Order Details - #{selectedOrderId}
            </h3>

            {/* Products List */}
            <div className="space-y-6">
              {groupedOrders[selectedOrderId].items.map((item, idx) => {
                const product = productDetailsMap[item.productId];
                return (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row gap-6 border rounded-md p-4 bg-gray-50"
                  >
                    <div className="flex-shrink-0">
                      {product ? (
                        <img
                          src={product.img1}
                          alt={product.productName}
                          className="rounded-md object-cover w-32 h-32"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-300 animate-pulse rounded-md"></div>
                      )}
                    </div>
                    <div className="flex-grow">
                      {product ? (
                        <>
                          <h4 className="text-lg font-semibold mb-1">
                            {product.productName}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            Current Price: ₹{product.totalPrice?.toLocaleString() || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            Buying Price: ₹{item.quantity > 0 ? Math.round(item.amount / item.quantity).toLocaleString() : 'N/A'}
                          </p>
                          <p className="text-sm mb-1">
                            Quantity: <strong>{item.quantity}</strong>
                          </p>
                          <p className="text-sm mb-1">
                            Item Total: <strong>₹{item.amount.toLocaleString()}</strong>
                          </p>
                          <p className="text-sm mb-1">
                            Payment Status: <strong className={item.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}>{item.paymentStatus}</strong>
                          </p>
                          {item.razorpayPaymentId && (
                            <p className="text-xs text-gray-500 mt-1">
                              Payment ID: {item.razorpayPaymentId}
                            </p>
                          )}
                        </>
                      ) : (
                        <p>Loading product info...</p>
                      )}

                      <p className="text-xs text-gray-500 mt-1">
                        Product ID: {item.productId}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shipping & Order Info */}
            <div className="mt-8 border-t pt-6">
              <h4 className="text-xl font-semibold mb-3">Shipping Address</h4>
              <p className="text-gray-700">{groupedOrders[selectedOrderId].user.name}</p>
              <p className="text-gray-700">{groupedOrders[selectedOrderId].items[0].fullAddress}</p>
              <p className="text-gray-700">
                {groupedOrders[selectedOrderId].items[0].city},{" "}
                {groupedOrders[selectedOrderId].items[0].state} -{" "}
                {groupedOrders[selectedOrderId].items[0].pincode}
              </p>
              <p className="text-gray-700">Email: {groupedOrders[selectedOrderId].user.email}</p>

              <div className="mt-4 space-y-1 text-gray-800 font-medium">
                <p>Payment Method: {groupedOrders[selectedOrderId].method}</p>
                <p>Status: {groupedOrders[selectedOrderId].orderStatus}</p>
                <p>Order ID: {groupedOrders[selectedOrderId].orderId}</p>
              </div>

              {/* Order Summary */}
              {(() => {
                const orderTotal = calculateOrderTotal(groupedOrders[selectedOrderId]);

                return (
                  <div className="mt-4 space-y-1 text-gray-800 font-medium">
                    <p className="font-bold text-lg text-green-600 bg-green-50 p-2 rounded">
                      Total Purchased Amount: ₹{orderTotal.toLocaleString()}
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
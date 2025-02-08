"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

interface Order {
  _id: string;
  customerName: string;
  email: string;
  amount: number;
  status: string;
  address: string;
  postalCode: string;
  createdAt: string;
}

const AdminPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders`);
      const data = await res.json();

      const sortedOrders = Array.isArray(data)
        ? data.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            if (a.status === "Delivered" && b.status !== "Delivered") return 1;
            if (b.status === "Delivered" && a.status !== "Delivered") return -1;
            return dateA - dateB; // Changed to sort by date descending
          })
        : [];

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchOrders();
  }, [status]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update order");

      toast.success("Order status updated!");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  if (status === "loading") {
    return (
      <div className="text-center mt-10 h-screen py-10 font-Poppins text-lg">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col ">
      <div className="container mx-auto px-2 sm:px-4 py-6 flex-grow">
        <h1 className="text-xl sm:text-3xl font-sans font-S mb-4 px-2">
          Admin Panel - Orders
        </h1>

        {loading ? (
          <div className="text-center font-Poppins text-lg">
            Loading orders...
          </div>
        ) : (
          <>
            {/* Desktop/Table View */}
            <div className="hidden sm:block overflow-x-auto rounded-lg shadow bg-white">
              <table className="min-w-full font-Satoshi">
                <thead className="bg-black text-white">
                  <tr>
                    {[
                      "Customer",
                      "Email",
                      "Amount",
                      "Status",
                      "Address",
                      "Postal Code",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="text-left p-3 text-sm font-medium"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-sm">{order.customerName}</td>
                      <td className="p-3 text-sm">{order.email}</td>
                      <td className="p-3 text-sm font-semibold">
                        ${order.amount}
                      </td>
                      <td className="p-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{order.address}</td>
                      <td className="p-3 text-sm">{order.postalCode}</td>
                      <td className="p-3 text-sm">
                        {order.status !== "Delivered" && (
                          <button
                            onClick={() => updateStatus(order._id, "Delivered")}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 font-Poppins ">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm">
                        {order.customerName}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{order.email}</p>
                    <p className="text-sm font-medium">${order.amount}</p>
                    <div className="text-xs">
                      <p className="text-gray-600">{order.address}</p>
                      <p className="text-gray-600">{order.postalCode}</p>
                    </div>
                    {order.status !== "Delivered" && (
                      <button
                        onClick={() => updateStatus(order._id, "Delivered")}
                        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm transition-colors"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center font-Poppins text-gray-500 mt-8">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

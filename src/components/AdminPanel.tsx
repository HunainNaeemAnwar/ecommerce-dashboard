"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

const ADMIN_EMAIL = "admin@example.com";

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

      // Sort orders: Newest first, Delivered at the bottom
      const sortedOrders = Array.isArray(data)
        ? data.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            if (a.status === "Delivered" && b.status !== "Delivered") return 1;
            if (b.status === "Delivered" && a.status !== "Delivered") return -1;

            return dateB - dateA; // Newest orders first
          })
        : [];

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const responseData = await res.json();
      console.log("API Response:", responseData);

      if (res.ok) {
        toast.success("Order status updated!");
        fetchOrders();
      } else {
        throw new Error(responseData.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Update Order Error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Error updating order status");
      } else {
        toast.error("Error updating order status");
      }
    }
  };

  if (status === "loading") {
    return (
      <p className="text-center mt-10 h-screen py-10 font-Poppins tex-lg">
        Loading...
      </p>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold font-Poppins mb-4">
        Admin Panel - Orders
      </h1>
      {loading ? (
        <p className="text-center font-Poppins text-lg">Loading orders...</p>
      ) : (
        <div className="overflow-auto ">
          <table className="max-w-full bg-white font-Satoshi border border-black">
            <thead>
              <tr className=" border-b bg-black text-white border-black ">
                <th className=" text-left">Customer</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Address</th>
                <th className="p-2 text-left">Postal Code</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-2">{order.customerName}</td>
                    <td className="p-2">{order.email}</td>
                    <td className="p-2 font-semibold">${order.amount}</td>
                    <td
                      className={`p-2 ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="p-2">{order.address}</td>
                    <td className="p-2">{order.postalCode}</td>
                    <td className="p-2">
                      {order.status !== "Delivered" && (
                        <button
                          onClick={() => updateStatus(order._id, "Delivered")}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm font-Poppins"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-2 font-Poppins text-sm"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

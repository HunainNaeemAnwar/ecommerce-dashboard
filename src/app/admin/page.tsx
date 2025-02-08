"use client";

import AdminPanel from "@/components/AdminPanel";
import { signOut } from "next-auth/react";

const AdminPage = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        {" "}
        <h1 className="text-3xl  font-Integral">Welcome Admin </h1>
        <button
          onClick={() => signOut()}
          className="bg-black text-gray-200 opacity-70 hover:opacity-100 transition-all transform duration-300  text-sm px-4 py-2 mt-4 rounded-md"
        >
          Sign Out
        </button>
      </div>
      <AdminPanel />
    </div>
  );
};

export default AdminPage;

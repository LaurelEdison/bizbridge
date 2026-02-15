import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { apiFetch } from "../api/client";
import type { Customer } from "../store/auth";

export default function CustomerSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const setToken = useAuthStore((s) => s.setToken);

  async function handleCustomerSignup(e: React.FormEvent) {
    e.preventDefault();
    try {
      const customer = await apiFetch<Customer>("/customer", {
        method: "POST",
        body: JSON.stringify({ name, email, password, country, description }),
      });
      const data = await apiFetch<{ token: string }>("/customer/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      console.log(data.token);

      const role = "customer";
      useAuthStore.getState().setRole(role);
      useAuthStore.getState().setCustomer(customer);
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed", err);
    }
  }

  return (
    <form
      onSubmit={handleCustomerSignup}
      className="flex flex-col gap-5 w-full max-w-md p-8 bg-white shadow-md rounded-2xl border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-[#094233] text-center mb-2">
        Customer Sign Up
      </h2>
      <p className="text-gray-600 text-center text-sm mb-4">
        Create your account to explore BizBridge and connect with trusted
        businesses.
      </p>

      <input
        className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#094233] transition"
        placeholder="Name"
        type="text"
        value={name}
        onChange={(s) => setName(s.target.value)}
      />
      <input
        className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#094233] transition"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(s) => setEmail(s.target.value)}
      />
      <input
        className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#094233] transition"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(s) => setPassword(s.target.value)}
      />
      <input
        className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#094233] transition"
        placeholder="Description"
        type="text"
        value={description}
        onChange={(s) => setDescription(s.target.value)}
      />
      <input
        className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#094233] transition"
        placeholder="Country"
        type="text"
        value={country}
        onChange={(s) => setCountry(s.target.value)}
      />

      <button
        type="submit"
        disabled={
          !name.trim() ||
          !email.trim() ||
          !password.trim() ||
          !country.trim() ||
          !description.trim()
        }
        className={`mt-2 py-3 rounded-full text-white font-semibold transition
      ${
        !name.trim() ||
        !email.trim() ||
        !password.trim() ||
        !country.trim() ||
        !description.trim()
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#094233] hover:bg-[#276749]"
      }`}
      >
        Sign Up
      </button>
    </form>
  );
}

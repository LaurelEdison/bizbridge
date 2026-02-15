import { useState } from "react";
import { useAuthStore } from "../store/auth";
import { apiFetch } from "../api/client";
import { SectorSelector } from "./SectorSelector";
import type { Company } from "../store/auth";
import { addCompanySector } from "../api/sector";

//TODO: Switch to access+refresh token
export default function CompanySignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const setToken = useAuthStore((s) => s.setToken);

  async function handleCompanySignup(e: React.FormEvent) {
    e.preventDefault();
    try {
      const company = await apiFetch<Company>("/company", {
        method: "POST",
        body: JSON.stringify({ name, email, password, address }),
      });
      const data = await apiFetch<{ token: string }>("/company/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      console.log(data.token);

      const role = "company";
      useAuthStore.getState().setRole(role);
      useAuthStore.getState().setCompany(company);

      for (const sectorID of selectedSectors) {
        await addCompanySector(sectorID);
      }
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed", err);
    }
  }

  return (
    <form
      onSubmit={handleCompanySignup}
      className="flex flex-col gap-5 w-full max-w-md p-8 bg-white shadow-md rounded-2xl border border-gray-100"
    >
      <h2 className="text-2xl font-semibold text-[#094233] text-center mb-2">
        Company Sign Up
      </h2>
      <p className="text-gray-600 text-center text-sm mb-4">
        Create your account to manage your company profile and connect with
        clients.
      </p>

      <input
        className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#094233] transition"
        placeholder="Name"
        value={name}
        onChange={(s) => setName(s.target.value)}
      />
      <input
        className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#094233] transition"
        placeholder="Email"
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
        placeholder="Address"
        value={address}
        onChange={(s) => setAddress(s.target.value)}
      />

      <div className="mt-2">
        <SectorSelector
          onChange={setSelectedSectors}
          selected={selectedSectors}
        />
      </div>

      <button
        type="submit"
        disabled={
          !name.trim() || !email.trim() || !password.trim() || !address.trim()
        }
        className={`mt-2 py-3 rounded-full text-white font-semibold transition
      ${
        !name.trim() || !email.trim() || !password.trim() || !address.trim()
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#094233] hover:bg-[#276749]"
      }`}
      >
        Sign Up
      </button>
    </form>
  );
}

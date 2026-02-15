import { useState } from "react";
import { createOrder } from "../api/payment";
import { sendMessage } from "../api/chat";
export default function CreateOrderButton({
  recipientId,
  chatRoomID,
}: {
  recipientId: string;
  chatRoomID: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateOrder = async () => {
    if (!amount || !description) return setError("Please fill in all fields");
    setError(null);
    setLoading(true);
    try {
      await createOrder(recipientId, parseFloat(amount), description);
      setShowModal(false);
      setAmount("");
      setDescription("");
      sendMessage(
        chatRoomID,
        "Succesfully created order\nDescription: " +
          description +
          "\nAmount: " +
          amount,
      );
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded-lg bg-[#198754] text-white font-medium hover:bg-[#157347] transition shadow-md flex items-center gap-2"
      >
        <span>Create Order</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40">
          <div className="bg-[#0e3d2e] rounded-xl shadow-2xl p-6 w-[420px] border border-[#146b50] text-white">
            <h2 className="text-xl font-semibold mb-4 text-[rgba(252,204,98,1)]">
              Create Order
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-[#094233] bg-[#fdfaf3] border border-[#c6b98a] rounded-md focus:ring-2 focus:ring-[rgba(252,204,98,0.8)] focus:outline-none"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-[#094233] bg-[#fdfaf3] border border-[#c6b98a] rounded-md focus:ring-2 focus:ring-[rgba(252,204,98,0.8)] focus:outline-none"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-[#198754] text-white font-medium hover:bg-[#157347] transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

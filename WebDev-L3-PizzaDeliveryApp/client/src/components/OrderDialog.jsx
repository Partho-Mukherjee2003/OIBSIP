import { useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";

const countries = [
  "India",
  "Bangladesh",
  "Nepal",
  "Pakistan",
  "USA",
  "UK",
  "Canada",
  "Australia",
];

const countryCodes = [
  { code: "+91", label: "India (+91)" },
  { code: "+880", label: "Bangladesh (+880)" },
  { code: "+1", label: "USA (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+977", label: "Nepal (+977)" },
  { code: "+92", label: "Pakistan (+92)" },
];

const inputClass =
  "w-full rounded-xl border-2 border-[#F5E6CC] bg-[#FFF9ED] px-4 py-2.5 text-sm outline-none focus:border-[#F7941D]";

const OrderDialog = ({ open, total, onClose, onConfirm }) => {
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [details, setDetails] = useState("");
  const [code, setCode] = useState("+91");
  const [number, setNumber] = useState("");
  const [confirming, setConfirming] = useState(false);

  if (!open) return null;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setConfirming(true);
    await onConfirm({
      address: { country, state, city, details },
      phone: `${code}${number}`,
    });
    setConfirming(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-[#141414] shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Your order total</p>
            <p className="text-3xl font-extrabold text-[#F7941D]">₹{total}</p>
            <p className="mt-1 text-sm text-gray-500">
              Hot &amp; fresh at your door in 30–45 minutes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-full bg-[#FFF9ED] p-2 text-gray-500 transition hover:bg-[#F7941D] hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="mt-6 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-semibold">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-semibold">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="West Bengal"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kolkata"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Detailed Address
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="House no, street, landmark..."
              rows={2}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-36 rounded-xl border-2 border-[#F5E6CC] bg-[#FFF9ED] px-3 py-2.5 text-sm outline-none focus:border-[#F7941D]"
              >
                {countryCodes.map(({ code, label }) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="98765 43210"
                required
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={confirming}
            className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold uppercase text-white transition ${
              confirming
                ? "cursor-not-allowed bg-[#b06a12]"
                : "cursor-pointer bg-[#F7941D] hover:bg-[#141414] active:scale-95"
            }`}
          >
            {confirming ? (
              <>
                <FaSpinner className="animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm Order"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderDialog;

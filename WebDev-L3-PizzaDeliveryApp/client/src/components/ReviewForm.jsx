import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

/* ---------- Animations (plain CSS, no extra packages) ---------- */
const styles = `
@keyframes rfPop { 0% { transform: scale(1); } 40% { transform: scale(1.45) rotate(-12deg); } 100% { transform: scale(1) rotate(0); } }
@keyframes rfLabel { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes rfThanks { from { opacity: 0; transform: translateY(10px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes rfShake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-6px); } 40%,80% { transform: translateX(6px); } }

.rf-pop { animation: rfPop .4s cubic-bezier(.2,.9,.3,1.2); }
.rf-label { animation: rfLabel .25s ease both; }
.rf-thanks { animation: rfThanks .5s cubic-bezier(.2,.8,.3,1) both; }
.rf-shake { animation: rfShake .4s ease; }

@media (prefers-reduced-motion: reduce) {
  .rf-pop, .rf-label, .rf-thanks, .rf-shake { animation: none; }
}
`;

const labels = ["", "Poor", "Fair", "Good", "Very good", "Loved it!"];

const ReviewForm = () => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [popped, setPopped] = useState(0);
  const [shake, setShake] = useState(false);
  const [thanks, setThanks] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const shown = hover || rating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to write a review");
      navigate("/login");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message, rating }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Thank you! Your review has been submitted.");
        setMessage("");
        setRating(0);
        setHover(0);
        setThanks(true);
        setTimeout(() => setThanks(false), 4000);
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <style>{styles}</style>

      <h3 className="text-lg font-extrabold uppercase text-white">
        Write a <span className="text-[#F7941D]">Review</span>
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Tell us how your pizza was. It helps others choose.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Rating */}
        <div>
          <div className="flex items-center gap-3">
            <div
              className={`flex gap-1 ${shake ? "rf-shake" : ""}`}
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    setPopped(star);
                  }}
                  onMouseEnter={() => setHover(star)}
                  aria-label={`Rate ${star} star`}
                  aria-pressed={star === rating}
                  className="cursor-pointer rounded text-2xl outline-none transition-transform duration-200 hover:scale-125 focus-visible:ring-2 focus-visible:ring-[#F7941D] active:scale-90"
                >
                  <FaStar
                    key={star === popped ? `p-${rating}` : "s"}
                    className={`transition-colors duration-200 ${
                      star <= shown ? "text-[#F7941D]" : "text-gray-600"
                    } ${star === popped && star <= rating ? "rf-pop" : ""}`}
                  />
                </button>
              ))}
            </div>

            <span
              key={shown}
              className="rf-label min-w-[4.5rem] text-sm font-semibold text-[#F7941D]"
            >
              {labels[shown]}
            </span>
          </div>
        </div>

        {/* Message */}
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What did you love? Taste, delivery, anything..."
            rows={4}
            required
            className="w-full resize-none rounded-2xl border-2 border-[#262626] bg-[#1f1f1f] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 hover:border-[#333] focus:border-[#F7941D] focus:bg-[#242424]"
          />
          <p className="mt-1 text-right text-xs text-gray-600">
            {message.length} {message.length === 1 ? "character" : "characters"}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold uppercase text-black transition-all duration-300 ${
            submitting
              ? "cursor-not-allowed bg-[#b06a12]"
              : "cursor-pointer bg-[#F7941D] hover:-translate-y-0.5 hover:bg-[#e07f0a] active:scale-95"
          }`}
        >
          {submitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </button>

        {thanks && (
          <p className="rf-thanks rounded-2xl border-2 border-[#F7941D]/40 bg-[#2a2013] px-4 py-3 text-center text-sm text-[#F7941D]">
            Thanks for sharing! We really appreciate it.
          </p>
        )}
      </form>
    </div>
  );
};

export default ReviewForm;

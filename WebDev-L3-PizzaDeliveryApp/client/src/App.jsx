import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessage = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/`);
        const text = await res.text;
        setMessage(text);
      } catch {
        setMessage("Server not connected");
      } finally {
        setLoading(false);
      }
    };
    loadMessage();
  }, []);

  return (
    <div>
      <h1>Pizza Dot</h1>
      <p>{loading ? "Loading..." : message}</p>
    </div>
  );
}

export default App;

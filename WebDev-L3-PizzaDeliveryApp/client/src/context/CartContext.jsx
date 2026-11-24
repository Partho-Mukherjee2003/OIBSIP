import { useEffect, useState } from "react";
import { CartContext } from "./cart-context";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("pizzaDotCart");
    return saved ? JSON.parse(saved) : [];
  });

  // cart change hole browser-e save kore rakho (refresh-eo thakbe)
  useEffect(() => {
    localStorage.setItem("pizzaDotCart", JSON.stringify(cart));
  }, [cart]);

  // pizza add koro — age theke thakle quantity 1 barbe
  const addToCart = (pizza) => {
    setCart((prev) => {
      const found = prev.find((item) => item._id === pizza._id);
      if (found) {
        return prev.map((item) =>
          item._id === pizza._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...pizza, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // quantity barao/komao — 0 hole item ta remove hoye jabe
  const updateQty = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity + change }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

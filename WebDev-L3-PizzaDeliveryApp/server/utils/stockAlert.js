import cron from "node-cron";
import Inventory from "../models/Inventory.js";
import { sendEmail } from "./sendEmail.js";

const checkLowStock = async () => {
  const lowItems = await Inventory.find({ stock: { $lt: 20 } });
  if (lowItems.length === 0) return;

  const list = lowItems
    .map((i) => `<li>${i.name} (${i.category}) — only ${i.stock} left</li>`)
    .join("");

  await sendEmail(
    process.env.ADMIN_EMAIL,
    "Pizza Dot — Low Stock Alert",
    `<h2>Low Stock Alert</h2><p>These items are below 20:</p><ul>${list}</ul>`,
  );
  console.log("Low stock email sent:", lowItems.length, "items");
};

// Proti ghontay check korbe
export const startStockAlert = () => {
  cron.schedule("0 * * * *", checkLowStock);
};

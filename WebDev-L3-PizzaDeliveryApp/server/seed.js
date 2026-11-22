import mongoose from "mongoose";
import dotenv from "dotenv";
import Pizza from "./models/Pizza.js";
import Inventory from "./models/Inventory.js";

dotenv.config();

const pizzas = [
  {
    name: "Margherita",
    description: "Classic tomato sauce and mozzarella cheese",
    price: 299,
    image: "/images/pizza/pizza-01.jpg",
    category: "Veg",
  },
  {
    name: "Pepperoni Feast",
    description: "Loaded pepperoni with extra cheese",
    price: 449,
    image: "/images/pizza/pizza-02.jpg",
    category: "Non-Veg",
  },
  {
    name: "BBQ Chicken",
    description: "Smoky BBQ sauce with grilled chicken",
    price: 499,
    image: "/images/pizza/pizza-03.jpg",
    category: "Non-Veg",
  },
  {
    name: "Veggie Supreme",
    description: "Capsicum, onion, mushroom, sweet corn and olives",
    price: 379,
    image: "/images/pizza/pizza-04.jpg",
    category: "Veg",
  },
  {
    name: "Cheese Burst",
    description: "Extra liquid cheese in every bite",
    price: 399,
    image: "/images/pizza/pizza-05.jpg",
    category: "Veg",
  },
  {
    name: "Tandoori Paneer",
    description: "Spicy tandoori paneer with mint sauce",
    price: 429,
    image: "/images/pizza/pizza-06.jpg",
    category: "Veg",
  },
  {
    name: "Mushroom Feast",
    description: "Fresh mushrooms with garlic and herbs",
    price: 359,
    image: "/images/pizza/pizza-07.jpg",
    category: "Veg",
  },
  {
    name: "Spicy Jalapeno",
    description: "Jalapeno, onion and spicy sauce for heat lovers",
    price: 389,
    image: "/images/pizza/pizza-08.jpg",
    category: "Veg",
  },
];

const inventory = [
  { name: "Thin Crust", category: "base", price: 100, stock: 100 },
  { name: "Thick Crust", category: "base", price: 120, stock: 100 },
  { name: "Cheese Burst Base", category: "base", price: 180, stock: 80 },
  { name: "Whole Wheat", category: "base", price: 110, stock: 90 },
  { name: "Garlic Base", category: "base", price: 130, stock: 85 },

  { name: "Tomato Sauce", category: "sauce", price: 30, stock: 200 },
  { name: "BBQ Sauce", category: "sauce", price: 40, stock: 150 },
  { name: "Peri Peri Sauce", category: "sauce", price: 45, stock: 150 },
  { name: "Cheese Sauce", category: "sauce", price: 50, stock: 150 },
  { name: "Mint Sauce", category: "sauce", price: 35, stock: 150 },

  { name: "Mozzarella", category: "cheese", price: 60, stock: 200 },
  { name: "Cheddar", category: "cheese", price: 70, stock: 150 },
  { name: "Parmesan", category: "cheese", price: 80, stock: 120 },

  { name: "Onion", category: "veg", price: 20, stock: 200 },
  { name: "Capsicum", category: "veg", price: 25, stock: 200 },
  { name: "Mushroom", category: "veg", price: 30, stock: 180 },
  { name: "Sweet Corn", category: "veg", price: 25, stock: 200 },
  { name: "Olives", category: "veg", price: 35, stock: 150 },
  { name: "Jalapeno", category: "veg", price: 30, stock: 150 },
  { name: "Tomato", category: "veg", price: 20, stock: 200 },
  { name: "Paneer", category: "veg", price: 50, stock: 120 },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Pizza.deleteMany();
    await Inventory.deleteMany();
    await Pizza.insertMany(pizzas);
    await Inventory.insertMany(inventory);
    console.log("Seed data inserted successfully");
    process.exit();
  } catch (error) {
    console.log("Seed error:", error.message);
    process.exit(1);
  }
};

seedData();

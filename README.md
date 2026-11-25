<!-- ============================================ -->
<!--   🍕 Pizza Dot — Pizza Delivery App 🍕    -->
<!-- ============================================ -->

<div align="center">

# 🍕 Pizza Dot — Pizza Delivery App

### Build Your Pizza. Track Your Order. Enjoy Every Slice. ✨

+4


[

img.shields.io

🌐_Live_Site-pizzadot--client.vercel.app-F7941D

](https://pizzadot-client.vercel.app)
[

img.shields.io

🖥️_Live_Server-pizzadot--server.vercel.app-339933

](https://pizzadot-server.vercel.app)
[

img.shields.io

💻_GitHub_Repo-OIBSIP-181717

](https://github.com/Partho-Mukherjee2003/OIBSIP)

</div>

📝 About (Short Description)
🍕 Pizza Dot — a full-stack pizza delivery app (React + Node.js + Express + MongoDB) where users browse pizzas, build their own custom pizza, pay with Razorpay, and track their order live — while admins manage orders, inventory, and low-stock email alerts. 🎓 Oasis Infobyte (AICTE OIB-SIP) Web Development Internship — Level 3.

Topics: react vite nodejs expressjs mongodb razorpay jwt tailwindcss pizza-delivery full-stack

📖 Project Description
Pizza Dot is a full-stack pizza delivery platform where users can browse pizzas, build a custom pizza with their favourite base, sauce, cheese and vegetables, pay online, and track their order from kitchen to doorstep. Admins manage incoming orders, update stock, and get an email alert when any item runs low.

🎓 Built as Oasis Infobyte (AICTE OIB-SIP) Web Development Internship — Level 3, a complete production-grade full-stack project with real payment integration.

🔗 Important Links
🔗 Link	🌐 URL
Live Site	https://pizzadot-client.vercel.app/
Live Server API	https://pizzadot-server.vercel.app/
GitHub Repository	https://github.com/Partho-Mukherjee2003/OIBSIP
✨ Features
🍕 User Features
🍕 Menu — browse 8 pizzas with category filter (Veg / Non-Veg / Under ₹400 / Build Your Own)
🛠️ Custom Pizza Builder — choose a base (5 options), sauce (5 options), cheese (3 types) & vegetables (multiple select) with a live total price
🛒 Cart — add menu pizzas, change quantity, remove items, and check out in one place
📍 Delivery Details — address & phone collected before payment, shown on the order for the user and the admin
💳 Razorpay Checkout (Test Mode) — after a successful payment the order shows Payment: Paid
📦 Live Order Tracking — Order Received → In Kitchen → Sent to Delivery, with live updates on My Orders
❌ Cancel Order — cancel an unpaid order while it is still Order Received
🧹 Remove from List — finished or cancelled orders can be removed from your list (hiding it on one side does not remove it from the other side)
📱 Fully responsive design for mobile, tablet & desktop
🛡️ Admin Features
📊 Admin Dashboard — admins see only the Admin area
📋 Order Management — view all incoming orders, update status, cancel unpaid orders
🗂️ Inventory Dashboard — live stock of pizza bases, sauces, cheeses & vegetables
➕ Manual Stock Update — change stock for any inventory item
📧 Low-Stock Email Alert — admin gets an email when any item falls below 20 units
🔄 Status changes reflect in real-time on the user's dashboard
🔐 Authentication & Security
📧 Register with email verification, login with JWT
🔵 Google sign-in
🔑 Forgot / Reset Password by email link
🎭 Role-based navigation — admin accounts open the Admin Dashboard, normal users open the user Dashboard, with protected routes
🛠️ Tech Stack
Layer	Technologies
Frontend	Vite + React, React Router, Tailwind CSS, React Icons, react-hot-toast
Backend	Node.js, Express.js, Mongoose
Database	MongoDB Atlas
Payment	Razorpay (Test Mode)
Email	Nodemailer (verification, password reset, low-stock alerts)
Deployment	Vercel (client + server)
⚙️ Environment Variables
Create a .env file in server (see below) and a .env file in client:

env
# server/.env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ADMIN_EMAIL=your_admin_email_address
CLIENT_URL=http://localhost:5173
env
# client/.env
VITE_SERVER_URL=http://localhost:5000
⚠️ Never commit real secrets. Keep them only in environment variables.

🚀 Installation & Run Locally
bash
# 1. Clone the repository
git clone https://github.com/Partho-Mukherjee2003/OIBSIP.git

# 2. Go to the project folder
cd OIBSIP/WebDev-L3-PizzaDeliveryApp/server

# 3. Install dependencies & run the server
npm install
npm run dev

# 4. Open a new terminal — run the client
cd ../client
npm install
npm run dev
🌐 Open http://localhost:5173 in your browser.

👨‍💻 Author
<div align="center">

Partho Mukherjee
Full Stack Developer (MERN) · BSc in Computer Science & Engineering, ISTT

[

img.shields.io

Gmail-parthomukherjee582@gmail.com-EA4335

](mailto:parthomukherjee582@gmail.com)
[

img.shields.io

LinkedIn-partho--mukherjee2005-0A66C2

](https://www.linkedin.com/in/partho-mukherjee2005)
[

img.shields.io

GitHub-Partho--Mukherjee2003-181717

](https://github.com/Partho-Mukherjee2003)

</div>

<div align="center">

🍕 Pizza Dot — Build Your Pizza. Track Your Order. Enjoy Every Slice. ✨

Made with ❤️ by Partho Mukherjee

</div>

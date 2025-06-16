
## 🏡 StayEase - Find Your Next Stay

**StayEase** is a full-stack Airbnb clone built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).
It provides a modern and mobile-responsive platform to **list, search, and book stays** across various categories like villas, farmhouses, pool houses, and more.

---

### 🚀 Live Demo

🔗 https://airbnb-frontend-pknj.onrender.com

---

## ✨ Features

✅ **User Authentication**

* Sign up & Login securely using JWT & cookies
* Passwords hashed using bcryptjs

✅ **Dynamic Listings**

* Create, update, and delete your own property listings
* Add title, description, rent, category, images, location (city & landmark)

✅ **Image Uploads**

* Seamless image hosting with Cloudinary via Multer

✅ **Search Functionality**

* Search for listings using location keywords

✅ **Categories**

* Explore properties by type: Villas, Farm Houses, Pool Houses, Trending, Shops, etc.

✅ **Bookings**

* Book any available listing
* View your bookings in the **"My Bookings"** section
* Cancel bookings if needed

✅ **Fully Responsive UI**

* Built with Tailwind CSS for clean and mobile-friendly design

✅ **Real-time UI Feedback**

* Integrated with React Toastify for notifications (e.g., success, error, cancel alerts)

---

## 🛠 Tech Stack

**Frontend:**

* React.js
* Tailwind CSS
* Axios
* React Router DOM
* React Toastify
* React Context API

**Backend:**

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Multer
* Cloudinary
* Cookie Parser
* CORS
* dotenv
* bcryptjs
* nodemon

---

## 🗃️ Folder Structure (Overview)

```
/client
  /components
  /pages
  App.jsx
  index.jsx

/server
  /controllers
  /models
  /routes
  /middleware
  server.js
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend and add:

```
PORT=5000
MONGODB_URL=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ⚙️ Installation & Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/stayease.git
cd stayease

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start both client and server
npm run dev
```

---

## 🌐 Deployment

This project is deployed using **Render**:

* Backend deployed on Render Node server
* Frontend deployed on Render Static Site

---

## 🙏 Acknowledgements

Thanks to:

* [Cloudinary](https://cloudinary.com/)
* [Render](https://render.com/)
* [Tailwind CSS](https://tailwindcss.com/)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---


# 🌍 TripTrek – Personalized Travel Wishlist App

**TripTrek** is a responsive travel wishlist application built using **React**. It empowers users to explore travel destinations and curate their own wishlist of dream locations. The app showcases mock “hot deals” on flights, hotels, and flight+hotel packages, making trip planning inspiring and interactive.

---

## ✨ Core Features

- 🧭 Browse curated travel destinations with details (city, country, description, and deal info)
- ✈️ Search and view mock flight deals (one-way and return) between Canadian and major world cities
- 🏨 Explore hotel and flight+hotel package deals
- ❤️ Add destinations to a personalized wishlist
- 🗑️ Remove destinations from wishlist
- 📄 View and manage the full wishlist
- 🗺️ Visualize all available deals and wishlist destinations on an interactive map (OpenStreetMap via Leaflet)
- 🔍 Large, prominent search bar for filtering destinations

---

## 💻 Tech Stack

| Category        | Technology             |
|-----------------|------------------------|
| Frontend        | **React** (with Hooks) |
| Styling         | **CSS**                |
| Routing         | **React Router DOM**   |
| Data Handling   | **Static JSON files**  |
| Map             | **Leaflet.js** + **react-leaflet** + **OpenStreetMap** |
| Flight Search   | **Express.js** mock API (backend) |
| Version Control | **Git & GitHub**       |

This tech stack is chosen to deliver a polished MVP efficiently, without requiring complex backend setup or external paid APIs. It’s lean, fast to build with, and easy to maintain.

---

## 🗂️ Project Structure

```
triptrek/
├── backend/
│   └── routes/
│       └── flights-sim.js
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FlightSearch.jsx
│   │   ├── OSMMapView.jsx
│   │   ├── DestinationCard.jsx
│   │   └── Wishlist.jsx
│   ├── context/
│   │   └── WishlistContext.js
│   ├── data/
│   │   └── deals.json
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Wishlist.jsx
│   ├── App.jsx
│   ├── index.js
│   ├── App.css
│   └── index.css
└── README.md
```

---

## 🧪 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/abbasbukhari/triptrek.git
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the backend (for flight search simulation)**
   ```bash
   cd backend
   npm install
   npm start
   ```
4. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm start
   ```

---

## 🗺️ Map Integration

- Uses **OpenStreetMap** tiles via **react-leaflet** for a free, interactive map experience.
- All deals with coordinates (`lat`, `lng`) are shown as pins on the map.
- No API key or payment required.

---

## 📦 Data

- All deals (flights, hotels, packages) are stored in `src/data/deals.json`.
- Images are sourced from [Unsplash](https://unsplash.com/) for high-quality, royalty-free visuals.

---

## 👥 Team

- [@abbasbukhari](https://github.com/abbasbukhari)
- [@amzia99](https://github.com/amzia99)

---


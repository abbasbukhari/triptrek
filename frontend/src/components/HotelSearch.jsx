import React, { useState } from "react";

const API_KEY = process.env.REACT_APP_MAKCORPS_API_KEY; // Store your API key in .env

export default function HotelSearch() {
  const [city, setCity] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [currency, setCurrency] = useState("USD");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Get city ID from mapping API
  const fetchCityId = async (cityName) => {
    const res = await fetch(`https://api.makcorps.com/mapping?api_key=${API_KEY}&name=${encodeURIComponent(cityName)}`);
    const data = await res.json();
    const cityObj = data.find(item => item.type === "GEO");
    return cityObj ? cityObj.document_id : null;
  };

  // Step 2: Fetch hotels by city ID
  const fetchHotels = async (cityId) => {
    const url = `https://api.makcorps.com/city?cityid=${cityId}&pagination=0&cur=${currency}&rooms=${rooms}&adults=${adults}&checkin=${checkin}&checkout=${checkout}&api_key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("No hotels found or API error.");
    return await res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setHotels([]);
    setLoading(true);
    try {
      const cityId = await fetchCityId(city);
      if (!cityId) throw new Error("City not found.");
      const hotelResults = await fetchHotels(cityId);
      setHotels(Array.isArray(hotelResults) ? hotelResults.filter(h => h.name) : []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="hotel-search-bar">
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={e => setCity(e.target.value)}
          required
        />
        <input
          type="date"
          value={checkin}
          onChange={e => setCheckin(e.target.value)}
          required
        />
        <input
          type="date"
          value={checkout}
          onChange={e => setCheckout(e.target.value)}
          required
        />
        <input
          type="number"
          min={1}
          value={adults}
          onChange={e => setAdults(e.target.value)}
          required
          style={{ width: 60 }}
          placeholder="Adults"
        />
        <input
          type="number"
          min={1}
          value={rooms}
          onChange={e => setRooms(e.target.value)}
          required
          style={{ width: 60 }}
          placeholder="Rooms"
        />
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="CAD">CAD</option>
          <option value="EUR">EUR</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Hotels"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {hotels.map((hotel, idx) => (
          <li key={hotel.hotelId || idx} style={{ marginBottom: "1em", border: "1px solid #ccc", padding: "1em" }}>
            <strong>{hotel.name}</strong><br />
            {hotel.reviews && (
              <span>Rating: {hotel.reviews.rating} ({hotel.reviews.count} reviews)<br /></span>
            )}
            {hotel.telephone && <span>Phone: {hotel.telephone}<br /></span>}
            {hotel.geocode && (
              <span>
                Location: {hotel.geocode.latitude}, {hotel.geocode.longitude}<br />
              </span>
            )}
            {["vendor1", "vendor2", "vendor3", "vendor4"].map((v, i) =>
              hotel[v] && hotel[`price${i + 1}`] ? (
                <span key={v}>
                  {hotel[v]}: {hotel[`price${i + 1}`]}<br />
                </span>
              ) : null
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
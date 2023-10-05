import { useEffect, useState } from "react";
import api from "../services/Api";

const Posts = () => {
  const [adverts, setAdverts] = useState([]);

  useEffect(() => {
    const fetchCarAdverts = async () => {
      try {
        const response = await api.get("car-adverts/all");
        setAdverts(response.data.results);
      } catch (error) {
        console.error("Error fetching car adverts:", error);
      }
    };

    fetchCarAdverts();
  }, []);

  return (
    <div className="card-container">
      {adverts.map((advert, index) => (
        <div key={index} className="card">
          {advert.title}{" "}
          {/* Assume each advert has a title property, adjust as needed */}
          <div>{advert.description}</div>
          <div>Price: {advert.price} &euro;</div>
          <div>Model: {advert.car.model.name}</div>
          <div>Color: {advert.car.color.name}</div>
          <div>Gearbox: {advert.car.gearbox.description}</div>
          <img src={advert.image} alt="Car advert image" />
        </div>
      ))}
    </div>
  );
};

export default Posts;
import { useEffect, useState } from "react";
import Api from "../services/api";

const Posts = () => {
  const [adverts, setAdverts] = useState([]);

  useEffect(() => {
    const api = new Api("/car-adverts/all");
    api
      .get()
      .then((data) => {
        setAdverts(data.results);
      })
      .catch((error) => console.error("Error fetching car adverts:", error));
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
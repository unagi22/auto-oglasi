import { useState } from "react";

export const Card = (car) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
      setIsExpanded((prevIsExpanded)=>!prevIsExpanded);
      console.log(isExpanded);
    };

  return (
    <div className={`card ${isExpanded ? "card-red" : ""}`} key={car.id} onClick={toggleExpand}>
      <img src={car.image} alt="Avatar" />
      <div className="container">
        <h4>
          <b>{car.name}</b>
        </h4>
        <p>{car.description}</p>
      </div>
    </div>
  );
};

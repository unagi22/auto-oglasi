import { useState } from "react";
import { Card } from "./Card";

export const CardList = () => {

  const [cars, setCars] = useState([
    {name : "volvo", description : "sveisvasta", image : "https://www.volvocars.com/images/v/-/media/applications/pdpspecificationpage/my24/xc40-fuel/specifications/xc40-hero-21x9.jpg?h=1098&iar=0&w=2560", id : 1},
    {name : "bmw", description : "sveisvasta", image : "https://imgd.aeplcdn.com/0x0/n/cw/ec/56433/exterior-right-front-three-quarter.jpeg?q=80", id : 2},
    {name : "audi", description : "sveisvasta", image : "https://hips.hearstapps.com/hmg-prod/images/img-1484-jpg-649644d3c1386.jpg?crop=0.571xw:0.762xh;0.240xw,0.195xh&resize=640:*", id : 3}
  ])

  return (
    <div className="card-list">
      {cars.map((car) => (
        <Card car={car} key={car.id}/>
      ))}
    </div>
  );
};

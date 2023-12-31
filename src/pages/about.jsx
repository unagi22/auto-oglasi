import { useEffect, useState } from "react";
import Api from "../services/Api.js";
const api = Api.getInstance();

const About = () => {
  const [aboutUsData, setAboutUsData] = useState([]);

  useEffect(() => {
    api
      .get("/pages/home")
      .then((data) => setAboutUsData(data))
      .catch((error) => console.error("Error fetching car adverts:", error));
  }, []);

  return (
    <div>
      <h2>{aboutUsData.title}</h2>
      <p dangerouslySetInnerHTML={{ __html: aboutUsData.content }}></p>
    </div>
  );
};

export default About;

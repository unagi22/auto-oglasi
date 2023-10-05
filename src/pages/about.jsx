import { useEffect, useState } from "react";
import api from "../services/Api";

const About = () => {
  const [aboutUsData, setAboutUsData] = useState([]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await api.get("/pages/home");
        setAboutUsData(response.data);
      } catch (error) {
        console.error("Error fetching about us data:", error);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div>
      <h2>{aboutUsData.title}</h2>
      <p dangerouslySetInnerHTML={{ __html: aboutUsData.content }}></p>
    </div>
  );
};

export default About;
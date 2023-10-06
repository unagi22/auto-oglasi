import { useEffect, useState } from "react";
import Api from "../services/Api.js";

const api = Api.getInstance();

const Profile = () => {
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    api
      .get("/profile")
      .then((data) => setProfileData(data))
      .catch((error) => console.error("Error fetching car adverts:", error));
  }, []);

  return (
    <div style={{ marginLeft: "10px", textAlign: "center" }}>
      <h1>Profile Page</h1>
      <hr />
      {profileData && (
        <div style={{ marginLeft: "10px" }}>
          <p>
            <span style={{ fontWeight: "bold" }}>First name:</span>{" "}
            {profileData.first_name}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Last name:</span>{" "}
            {profileData.last_name}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Email address:</span>{" "}
            {profileData.email}
          </p>
          {profileData.profile_picture && (
            <img src={profileData.profile_picture} alt="Profile picture" />
          )}
          <p>
            <span style={{ fontWeight: "bold" }}>Country:</span>{" "}
            {profileData.country?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;

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
    <div>
      <h1>Profile Page</h1>
      {profileData && (
        <div>
          <div>First name: {profileData.first_name}</div>
          <div>Last name: {profileData.last_name}</div>
          <div>Email address: {profileData.email}</div>
          {profileData.profile_picture && (
            <img src={profileData.profile_picture} alt="Profile picture" />
          )}
          <div>Country: {profileData.country?.name}</div>
        </div>
      )}
    </div>
  );
};

export default Profile;

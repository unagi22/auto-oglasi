import { useEffect, useState } from "react";
import api from "../services/Api";

const Profile = () => {
  const [profileData, setProfileData] = useState({});

    useEffect(() => {
      const fetchProfileData = async () => {
        try {
          const response = await api.get("profile/");
          setProfileData(response.data);
        } catch (error) {
          console.error("Error fetching car adverts:", error);
        }
      };
  
      fetchProfileData();
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
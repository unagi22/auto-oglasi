import { useEffect, useState } from "react";
import Api from "../services/Api.js";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
    <Box sx={{ marginLeft: "10px", textAlign: "center" }}>
      <Typography variant="h4" sx={{ my: 3, fontWeight: "bold" }}>Profile Page</Typography>{" "}
      <hr />
      {profileData && (
        <Box sx={{ ml: '10px', mt: 5 }}>
          <Box sx={{ mt: 3 }}>
            <Typography component="span" variant="body1" sx={{ fontWeight: "bold" }}>First name:</Typography>{" "}
            <Typography component="span" variant="body2">{profileData.first_name}</Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography component="span" variant="body1" sx={{ fontWeight: "bold" }}>Last name:</Typography>{" "}
            <Typography component="span" variant="body2">{profileData.last_name}</Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography component="span" variant="body1" sx={{ fontWeight: "bold" }}>Email address:</Typography>{" "}
            <Typography component="span" variant="body2">{profileData.email}</Typography>
          </Box>
          {profileData.profile_picture && (
            <img src={profileData.profile_picture} alt="Profile picture" />
          )}
            <Box sx={{ mt: 3 }}>
              <Typography component="span" variant="body1" sx={{ fontWeight: "bold" }}>Country:</Typography>{" "}
              <Typography component="span" variant="body2">{profileData.country?.name}</Typography>
            </Box>
        </Box>
      )}
    </Box>
  );
};

export default Profile;

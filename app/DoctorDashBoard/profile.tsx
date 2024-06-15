// pages/profile.tsx

import React from "react";
import ProfileForm from "./ProfileForm";

interface ProfileProps {
  userId: number | null;
  username: string | null;
}

const Profile: React.FC<ProfileProps> = ({ userId, username }) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <ProfileForm doctorId={userId} />
    </>
  );
};

export default Profile;

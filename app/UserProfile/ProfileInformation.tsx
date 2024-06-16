import { useState } from "react";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  orders: any[];
}

const ProfileInformation = ({
  user,
  handleUpdateProfile,
}: {
  user: UserProfile;
  handleUpdateProfile: (user: UserProfile) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(user);

  const handleChange = (field: keyof UserProfile, value: string) => {
    const updatedUser = { ...editedUser, [field]: value };
    setEditedUser(updatedUser);
    handleUpdateProfile(updatedUser);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset editedUser to the original user data if cancelling edit
    if (isEditing) {
      setEditedUser(user);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md ml-64">
      <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            value={editedUser.first_name}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            onChange={(e) => handleChange("first_name", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            value={editedUser.last_name}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            onChange={(e) => handleChange("last_name", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={editedUser.email}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            disabled
          />
        </div>
        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            value={editedUser.address}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            onChange={(e) => handleChange("address", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            value={editedUser.city}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            onChange={(e) => handleChange("city", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-gray-700">Postal Code</label>
          <input
            type="text"
            value={editedUser.postal_code}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            onChange={(e) => handleChange("postal_code", e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block text-gray-700">Country</label>
          <input
            type="text"
            value={editedUser.country}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            onChange={(e) => handleChange("country", e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleEditToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfileInformation;

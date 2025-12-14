import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchUserProfile, updateUserProfile } from "../../../api/account/account-api";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { getInitials } from "../../../utils/strings";

const ProfileTab = () => {
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();

  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [currentProfileImage, setCurrentProfileImage] = useState<string>('');

  // Profile queries and mutations
  const { data: profile, isLoading: profileLoading } = useQuery("userProfile", fetchUserProfile, {
    onSuccess: (data) => {
      if (data) {
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
        setCurrentProfileImage(data.imageUrl || '');
      }
    }
  });

  const updateProfileMutation = useMutation(
    (formData: FormData) => {
      const userId = localStorage.getItem('userId') || '';
      return updateUserProfile(userId, formData);
    },
    {
      onSuccess: () => {
        notifyUser("Profile updated successfully", "success");
        queryClient.invalidateQueries("userProfile");
      },
      onError: (error: any) => {
        notifyUser(error?.response?.data?.message || "Failed to update profile", "error");
      }
    }
  );

  // Profile handlers
  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('phone', profileData.phone);

    if (profileImage) {
      formData.append('file', profileImage);
    }

    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>

        {profileLoading ? (
          <CircleLoader />
        ) : (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">

                <img
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  src={currentProfileImage || `https://placehold.co/100x100?text=${getInitials(profileData.name)}`}
                  alt="Profile"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-500">Update your profile picture</p>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-org-primary file:text-white hover:file:bg-opacity-90"
                  />
                </div>
              </div>
            </div>

            {/* Profile Information Form */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleProfileInputChange('name', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-org-primary focus:border-org-primary"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  disabled
                  value={profileData.email}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-org-primary focus:border-org-primary"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-org-primary focus:border-org-primary"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateProfileMutation.isLoading}
                className="px-6 py-2 bg-org-primary text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {updateProfileMutation.isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
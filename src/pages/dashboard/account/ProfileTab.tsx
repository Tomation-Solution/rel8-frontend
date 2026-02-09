import { useState, useEffect } from "react";
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
  const [serverProfileImage, setServerProfileImage] = useState<string>('');
  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(null);

  // Profile queries and mutations
  const { data: profile, isLoading: profileLoading } = useQuery("userProfile", fetchUserProfile, {
    onSuccess: (data) => {
      if (data) {
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
        // Only update server image if no preview is active
        if (!previewProfileImage) {
          setServerProfileImage(data.imageUrl || '');
        }
      }
    }
  });

  const updateProfileMutation = useMutation(
    ({ formData, userId }: { formData: FormData; userId: string }) => {
      return updateUserProfile(userId, formData);
    },
    {
      onSuccess: (data) => {
        notifyUser("Profile updated successfully", "success");
        queryClient.invalidateQueries("userProfile");
        // clear selected file and revoke preview (will be refreshed from server)
        setProfileImage(null);
        // Update server image with the new image from the response
        if (data?.imageUrl) {
          setServerProfileImage(data.imageUrl);
        }
        // Clear preview
        if (previewProfileImage) {
          URL.revokeObjectURL(previewProfileImage);
          setPreviewProfileImage(null);
        }
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
      const file = e.target.files[0];
      setProfileImage(file);
      console.log(file,'file here')


      // create a temporary preview and clean up the previous one
      const url = URL.createObjectURL(file);
      setPreviewProfileImage(url);
      if (previewProfileImage) {
        URL.revokeObjectURL(previewProfileImage);
      }
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
      console.log('file', profileImage)
    }
    // prefer server-provided id, fall back to localStorage (defensive)
    const userId = profile && (profile._id || profile.id) ? (profile._id || profile.id) : (localStorage.getItem('userId') || '');
    if (!userId) {
      notifyUser('Unable to determine user id for profile update', 'error');
      return;
    }

    updateProfileMutation.mutate({ formData, userId });
  };

  // revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewProfileImage) {
        URL.revokeObjectURL(previewProfileImage);
      }
    };
  }, [previewProfileImage]);

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
                  src={previewProfileImage || serverProfileImage || `https://placehold.co/100x100?text=${getInitials(profileData.name)}`}
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
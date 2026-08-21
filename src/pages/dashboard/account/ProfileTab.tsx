import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchUserProfile, updateUserProfile } from "../../../api/account/account-api";
import Toast from "../../../components/toast/Toast";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { getInitials } from "../../../utils/strings";
import { Button, Card } from "../../../components/ui";
import { useAppContext } from "../../../context/authContext";

const ProfileTab = () => {
  const { notifyUser } = Toast();
  const queryClient = useQueryClient();
  const { user } = useAppContext();

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    bio: "",
    linkedIn: "",
    twitter: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [serverProfileImage, setServerProfileImage] = useState<string>("");
  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(null);

  // Profile queries and mutations
  const { data: profile, isLoading: profileLoading } = useQuery("userProfile", fetchUserProfile, {
    onSuccess: data => {
      if (data) {
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          jobTitle: data.jobTitle || "",
          bio: data.bio || "",
          linkedIn: data.linkedIn || "",
          twitter: data.twitter || "",
        });
        // Only update server image if no preview is active
        if (!previewProfileImage) {
          setServerProfileImage(data.imageUrl || "");
        }
      }
    },
  });

  const updateProfileMutation = useMutation(
    ({ formData, userId }: { formData: FormData; userId: string }) => {
      return updateUserProfile(userId, formData);
    },
    {
      onSuccess: data => {
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
      },
    },
  );

  // Profile handlers
  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      console.log(file, "file here");

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
    formData.append("name", profileData.name);
    formData.append("phone", profileData.phone);
    if (profileData.jobTitle) formData.append("jobTitle", profileData.jobTitle);
    if (profileData.bio) formData.append("bio", profileData.bio);
    if (profileData.linkedIn) formData.append("linkedIn", profileData.linkedIn);
    if (profileData.twitter) formData.append("twitter", profileData.twitter);

    if (profileImage) {
      formData.append("file", profileImage);
      console.log("file", profileImage);
    }
    // prefer server-provided id, fall back to localStorage (defensive)
    const userId = profile && (profile._id || profile.id) ? profile._id || profile.id : localStorage.getItem("userId") || "";
    if (!userId) {
      notifyUser("Unable to determine user id for profile update", "error");
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
      <Card accent className="p-6">

        {profileLoading ? (
          <CircleLoader />
        ) : (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center text-center">
              <div className="flex-shrink-0">
                <img className="w-24 h-24 rounded-full object-cover bg-org-tint" src={previewProfileImage || serverProfileImage || `https://placehold.co/100x100?text=${getInitials(profileData.name)}`} alt="" />
              </div>
              <div className="mt-3">
                <h3 className="text-[15px] font-medium text-ink">Profile Picture</h3>
                <p className="text-sm text-muted">Update your profile picture</p>
                <div className="mt-3 flex justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="block text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-org-tint file:text-org-primary hover:file:bg-org-tint-strong"
                  />
                </div>
              </div>
            </div>

            {/* Profile Information Form */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-ink">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={e => handleProfileInputChange("name", e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 border border-hairline rounded-lg outline-none text-ink placeholder:text-muted focus:border-org-primary"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Email</label>
                <input type="email" disabled value={profileData.email} className="mt-1 block w-full px-3 py-2.5 border border-hairline rounded-lg outline-none text-ink placeholder:text-muted focus:border-org-primary" placeholder="Enter email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={e => handleProfileInputChange("phone", e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 border border-hairline rounded-lg outline-none text-ink placeholder:text-muted focus:border-org-primary"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">
                  Job Title <span className="text-muted font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={profileData.jobTitle}
                  onChange={e => handleProfileInputChange("jobTitle", e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 border border-hairline rounded-lg outline-none text-ink placeholder:text-muted focus:border-org-primary"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">
                  Bio <span className="text-muted font-normal">(optional)</span>
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={e => handleProfileInputChange("bio", e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2.5 border border-hairline rounded-lg outline-none text-ink placeholder:text-muted focus:border-org-primary resize-none"
                  placeholder="A short bio about yourself"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">
                  LinkedIn <span className="text-muted font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={profileData.linkedIn}
                  onChange={e => handleProfileInputChange("linkedIn", e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 border border-hairline rounded-lg outline-none text-ink placeholder:text-muted focus:border-org-primary"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">
                  Twitter / X <span className="text-muted font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={profileData.twitter}
                  onChange={e => handleProfileInputChange("twitter", e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 border border-hairline rounded-lg outline-none text-ink placeholder:text-muted focus:border-org-primary"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
            </div>

            {/*
              The mockup shows an "Environment" field. `Member.memberType` / the member's
              environments are set by an admin — `PUT /api/members/profile` does not accept
              them — so this is read-only rather than an input that silently discards edits.
            */}
            <div>
              <label className="block text-sm font-medium text-ink">Environment</label>
              <p className="mt-1 flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-org-tint text-org-primary text-sm">
                {(user as any)?.memberType?.name || ((user as any)?.exco?.isExco ? "Exco" : "Member")}
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-start">
              <Button htmlType="submit" isLoading={updateProfileMutation.isLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ProfileTab;

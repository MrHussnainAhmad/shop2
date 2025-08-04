"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Camera, User, Mail, Phone } from "lucide-react";
import Image from "next/image";

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const EditProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load user data when component mounts
  useEffect(() => {
    if (isLoaded && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "",
      });
    }
  }, [isLoaded, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      let hasUpdates = false;

      // Handle phone number update
      const currentPhone = user.phoneNumbers?.[0]?.phoneNumber;
      if (formData.phoneNumber && formData.phoneNumber !== currentPhone) {
        try {
          if (user.phoneNumbers.length > 0) {
            // Delete existing phone number
            await user.phoneNumbers[0].destroy();
          }
          
          if (formData.phoneNumber.trim()) {
            // Add new phone number
            await user.createPhoneNumber({ phoneNumber: formData.phoneNumber });
            hasUpdates = true;
          }
        } catch (phoneError: any) {
          console.warn("Phone number update failed:", phoneError);
          setErrorMessage("Phone number update failed. Please try again.");
        }
      }

      // For now, we'll show a message that name updates require admin intervention
      const nameChanged = formData.firstName !== user.firstName || formData.lastName !== user.lastName;
      
      if (nameChanged) {
        setErrorMessage("Name updates are currently not supported through this interface. Please contact support to update your name.");
      } else if (hasUpdates) {
        setSuccessMessage("Profile updated successfully!");
      } else {
        setSuccessMessage("No changes detected.");
      }
      
      // Clear messages after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.errors?.[0]?.message || error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    try {
      await user.setProfileImage({ file });
      setSuccessMessage("Profile image updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      console.error("Error updating profile image:", error);
      setErrorMessage("Failed to update profile image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Please sign in to edit your profile</h2>
          <p className="text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Profile Image Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <User size={40} className="text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
            <Camera size={16} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
        </div>
        <p className="text-sm text-gray-600">Click the camera icon to update your profile picture</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline w-4 h-4 mr-1" />
            Email Address
          </label>
          <input
            type="email"
            value={user.emailAddresses?.[0]?.emailAddress || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            disabled
            title="Email cannot be changed here. Please contact support if you need to change your email."
          />
          <p className="mt-1 text-xs text-gray-500">Email address cannot be changed from this page</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline w-4 h-4 mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your phone number"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Account Information */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Account ID:</span>
            <span className="ml-2 text-gray-900 font-mono">{user.id}</span>
          </div>
          <div>
            <span className="text-gray-600">Member since:</span>
            <span className="ml-2 text-gray-900">
              {new Date(user.createdAt!).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Last sign in:</span>
            <span className="ml-2 text-gray-900">
              {user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : "Never"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;

"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Image from 'next/image';

interface WebDataFormProps {
  initialData?: any;
}

const WebDataForm: React.FC<WebDataFormProps> = ({ initialData }) => {
  const [formData, setFormData] = useState<any>(initialData || {
    aboutUs: '',
    terms: '',
    privacy: '',
    faqs: '',
    help: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
    },
    contactInfo: {
      visitUs: '',
      callUs: '',
      emailUs: '',
      workingHours: '',
    },
    logo: '',
    storeName: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);
      setError(null);
      const file = e.target.files[0];
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const result = await response.json();
        setFormData(prev => ({
          ...prev,
          logo: result.secure_url,
        }));
        toast.success('Image uploaded successfully!');
      } catch (err: any) {
        setError(err.message);
        toast.error(`Image upload failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put('/api/webdata', formData);
      toast.success('Web data updated successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to save web data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mb-4">About Us & Policies</h2>
      <div>
        <label htmlFor="aboutUs" className="block text-sm font-medium text-gray-700 mb-1">About Us Content</label>
        <textarea id="aboutUs" name="aboutUs" value={formData.aboutUs} onChange={handleChange} rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>
      <div>
        <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions Content</label>
        <textarea id="terms" name="terms" value={formData.terms} onChange={handleChange} rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>
      <div>
        <label htmlFor="privacy" className="block text-sm font-medium text-gray-700 mb-1">Privacy Policy Content</label>
        <textarea id="privacy" name="privacy" value={formData.privacy} onChange={handleChange} rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>
      <div>
        <label htmlFor="faqs" className="block text-sm font-medium text-gray-700 mb-1">FAQs Content</label>
        <textarea id="faqs" name="faqs" value={formData.faqs} onChange={handleChange} rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>
      <div>
        <label htmlFor="help" className="block text-sm font-medium text-gray-700 mb-1">Help Content</label>
        <textarea id="help" name="help" value={formData.help} onChange={handleChange} rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>

      <h2 className="text-xl font-semibold mb-4 mt-8">Social Media Links</h2>
      <div>
        <label htmlFor="socialLinks.facebook" className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
        <input type="text" id="socialLinks.facebook" name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
        <input type="text" id="socialLinks.twitter" name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="socialLinks.instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
        <input type="text" id="socialLinks.instagram" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="socialLinks.linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
        <input type="text" id="socialLinks.linkedin" name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="socialLinks.youtube" className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
        <input type="text" id="socialLinks.youtube" name="socialLinks.youtube" value={formData.socialLinks.youtube} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <h2 className="text-xl font-semibold mb-4 mt-8">Contact Information</h2>
      <div>
        <label htmlFor="contactInfo.visitUs" className="block text-sm font-medium text-gray-700 mb-1">Visit Us</label>
        <input type="text" id="contactInfo.visitUs" name="contactInfo.visitUs" value={formData.contactInfo.visitUs} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="contactInfo.callUs" className="block text-sm font-medium text-gray-700 mb-1">Call Us</label>
        <input type="text" id="contactInfo.callUs" name="contactInfo.callUs" value={formData.contactInfo.callUs} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="contactInfo.emailUs" className="block text-sm font-medium text-gray-700 mb-1">Email Us</label>
        <input type="text" id="contactInfo.emailUs" name="contactInfo.emailUs" value={formData.contactInfo.emailUs} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="contactInfo.workingHours" className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
        <input type="text" id="contactInfo.workingHours" name="contactInfo.workingHours" value={formData.contactInfo.workingHours} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <h2 className="text-xl font-semibold mb-4 mt-8">Store Information</h2>
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
        <input type="text" id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <h2 className="text-xl font-semibold mb-4 mt-8">Logo</h2>
      <div>
        <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">Store Logo</label>
        <input type="file" id="logo" name="logo" onChange={handleImageUpload} className="mt-1 block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {formData.logo ? (
          <div className="mt-2">
            <Image src={formData.logo} alt="Store Logo" className="w-32 h-32 object-contain rounded-md border border-gray-200 shadow-sm" width={128} height={128} />
          </div>
        ) : (
          <div className="mt-2 w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">No Logo</div>
        )}
      </div>

      <button type="submit" disabled={loading} className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
        {loading ? 'Saving...' : 'Save Web Data'}
      </button>
    </form>
  );
};

export default WebDataForm;

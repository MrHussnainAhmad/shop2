"use client";

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const BrandSectionAdmin = () => {
  const [sectionSettings, setSectionSettings] = useState({
    shopByBrandsVisible: true
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch current settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setFetching(true);
    try {
      const response = await fetch('/api/webdata');
      if (response.ok) {
        const data = await response.json();
        setSectionSettings(data.sectionSettings || { shopByBrandsVisible: true });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load section settings');
    } finally {
      setFetching(false);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newSettings = {
        ...sectionSettings,
        shopByBrandsVisible: !sectionSettings.shopByBrandsVisible
      };

      const response = await fetch('/api/webdata', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionSettings: newSettings
        }),
      });

      if (response.ok) {
        setSectionSettings(newSettings);
        toast.success(
          newSettings.shopByBrandsVisible 
            ? 'Shop by Brands section is now visible on homepage' 
            : 'Shop by Brands section is now hidden from homepage'
        );
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update section visibility');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8" />
          Brand Section Management
        </h1>
        <p className="text-gray-600">
          Control the visibility of the "Shop by Brands" section on your homepage. 
          When hidden, the sections below will move up automatically.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Shop by Brands Section
            </h3>
            <p className="text-gray-600 mb-4">
              This section displays brand logos and company information on the homepage.
              Toggle its visibility below.
            </p>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Current Status:
              </span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                sectionSettings.shopByBrandsVisible 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {sectionSettings.shopByBrandsVisible ? (
                  <>
                    <Eye className="w-4 h-4" />
                    Visible
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hidden
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
            <button
              onClick={handleToggle}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                sectionSettings.shopByBrandsVisible
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </div>
              ) : sectionSettings.shopByBrandsVisible ? (
                <>
                  <EyeOff className="w-4 h-4 inline mr-2" />
                  Hide Section
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 inline mr-2" />
                  Show Section
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📝 How it works:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Visible:</strong> The "Shop by Brands" section appears on the homepage between categories and other content</li>
            <li>• <strong>Hidden:</strong> The section is completely removed from the homepage, and content below moves up automatically</li>
            <li>• Changes take effect immediately on the homepage after updating</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Note:</h4>
          <p className="text-sm text-yellow-800">
            This only controls visibility on the homepage. Users can still access brand pages directly 
            through URLs or navigation menus if available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandSectionAdmin;

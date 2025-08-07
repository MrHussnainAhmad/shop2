"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Banner {
  _id: string;
  title: string;
  name?: string;
  description?: string;
  slug?: string;
  badge?: string;
  discountAmount?: number;
  image: string; // This will now store the Cloudinary URL
  imageUrl?: string; // Keeping for backward compatibility if needed, but 'image' will be primary
  link?: string;
  isMiniBanner: boolean;
  createdAt: string;
}

const BannerAdminPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    title: '',
    image: '',
    isMiniBanner: false,
  });
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/banners');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setBanners(data);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch banners:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (editingBanner) {
      setEditingBanner({
        ...editingBanner,
        [name]: type === 'checkbox' ? checked : value,
      });
    } else {
      setNewBanner({
        ...newBanner,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data.imageUrl; // Cloudinary URL
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to upload image:", e);
      return null;
    } finally {
      setUploading(false);
      setSelectedFile(null); // Clear selected file after upload attempt
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let imageUrl = editingBanner?.image || newBanner.image;

    if (selectedFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        // If upload failed, stop submission
        return;
      }
    }

    try {
      const method = editingBanner ? 'PUT' : 'POST';
      const url = editingBanner ? `/api/banners/${editingBanner._id}` : '/api/banners';
      
      const dataToSend = {
        ...(editingBanner || newBanner),
        image: imageUrl, // Use the uploaded URL or existing URL
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      setNewBanner({ title: '', image: '', isMiniBanner: false });
      setEditingBanner(null);
      fetchBanners(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to save banner:", e);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setNewBanner({ title: '', image: '', isMiniBanner: false }); // Clear new banner form
    setSelectedFile(null); // Clear any selected file when editing
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      fetchBanners(); // Refresh the list
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to delete banner:", e);
    }
  };

  const currentImagePreview = selectedFile 
    ? URL.createObjectURL(selectedFile) 
    : (editingBanner?.image || newBanner.image || '');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Banner Management</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={editingBanner?.title || newBanner.title || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image Upload</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
            {currentImagePreview && (
              <div className="mt-2">
                <img src={currentImagePreview} alt="Image Preview" className="w-32 h-auto object-cover rounded" />
              </div>
            )}
            {uploading && <p>Uploading image...</p>}
          </div>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={editingBanner?.name || newBanner.name || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={editingBanner?.description || newBanner.description || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={editingBanner?.slug || newBanner.slug || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="badge">Badge</Label>
            <Input
              id="badge"
              name="badge"
              value={editingBanner?.badge || newBanner.badge || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="discountAmount">Discount Amount</Label>
            <Input
              id="discountAmount"
              name="discountAmount"
              type="number"
              value={editingBanner?.discountAmount || newBanner.discountAmount || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              name="link"
              value={editingBanner?.link || newBanner.link || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="isMiniBanner"
            name="isMiniBanner"
            checked={editingBanner?.isMiniBanner || newBanner.isMiniBanner || false}
            onCheckedChange={(checked: boolean) => handleInputChange({
              target: {
                name: 'isMiniBanner',
                value: checked,
                type: 'checkbox',
                checked,
              },
            } as React.ChangeEvent<HTMLInputElement>)}
          />
          <Label htmlFor="isMiniBanner">Is Mini Banner?</Label>
        </div>
        <div className="flex space-x-2">
          <Button type="submit" disabled={uploading}>{editingBanner ? 'Update Banner' : 'Add Banner'}</Button>
          {editingBanner && (
            <Button type="button" variant="outline" onClick={() => setEditingBanner(null)} disabled={uploading}>
              Cancel Edit
            </Button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">Existing Banners</h2>
      {loading ? (
        <p>Loading banners...</p>
      ) : banners.length === 0 ? (
        <p>No banners found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Mini Banner</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner._id}>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>
                    <img src={banner.image} alt={banner.title} className="w-20 h-auto object-cover rounded" />
                  </TableCell>
                  <TableCell>{banner.isMiniBanner ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(banner._id)}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BannerAdminPage;

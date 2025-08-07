"use client";
import React, { useEffect, useState } from "react";
import FooterTop from "./FooterTop";
import Container from "./Container";
import Link from "next/link";
import { Youtube, Github, Linkedin, Facebook, Slack } from "lucide-react";
import Logo from "./Logo";
import { getCategories } from "@/lib/api";
import { Category } from '@/models/Category';

const date = new Date();

interface FooterProps {
  webData: any; // Define a proper type for WebData if available
  logo: string; // New logo prop
}

const Footer: React.FC<FooterProps> = ({ webData, logo }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="bg-white text-gray-800">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="mb-4">
              <Logo headerLogo={logo} />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {webData?.aboutUs || "Discover curated furniture collections at Logo, blending style and comfort to elevate your living spaces."}
            </p>
            <div className="flex gap-3">
              {webData?.socialLinks?.youtube && (
                <Link
                  href={webData.socialLinks.youtube}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Youtube size={20} />
                </Link>
              )}
              {webData?.socialLinks?.twitter && (
                <Link
                  href={webData.socialLinks.twitter}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Github size={20} />
                </Link>
              )}
              {webData?.socialLinks?.linkedin && (
                <Link
                  href={webData.socialLinks.linkedin}
                  className="text-600 hover:text-red-500 transition-colors"
                >
                  <Linkedin size={20} />
                </Link>
              )}
              {webData?.socialLinks?.facebook && (
                <Link
                  href={webData.socialLinks.facebook}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Facebook size={20} />
                </Link>
              )}
              {webData?.socialLinks?.instagram && (
                <Link
                  href={webData.socialLinks.instagram}
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Slack size={20} />
                </Link>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/aboutus"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="/contactus"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 hover:text-red-500 transition-colors"
                >
                  Help
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories && categories.length > 0 ? (
                categories.map((category: Category) => (
                  <li key={category._id}>
                    <Link
                      href={`/shop/category/${category.slug.current}`}
                      className="text-gray-600 hover:text-red-500 transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <span className="text-gray-500">No categories available</span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {webData?.contactInfo?.visitUs && <li>Visit Us: {webData.contactInfo.visitUs}</li>}
              {webData?.contactInfo?.callUs && <li>Call Us: {webData.contactInfo.callUs}</li>}
              {webData?.contactInfo?.emailUs && <li>Email Us: {webData.contactInfo.emailUs}</li>}
              {webData?.contactInfo?.workingHours && <li>Working Hours: {webData.contactInfo.workingHours}</li>}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-600">
          © {date.getFullYear()}{" "}
          <span className="font-semibold">{webData?.storeName || "Logo"}</span>. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

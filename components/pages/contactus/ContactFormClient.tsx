"use client";

import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Linkedin, Github, Instagram, Phone, MapPin, Clock, Facebook, Youtube } from 'lucide-react';
import Container from '@/components/common/Container';
import Header from "@/components/header/Header";
import CartMenu from "@/components/common/CartMenu";
import "./styles/Contact.css"; // Assuming you'll create this file

interface ContactFormClientProps {
  webData: any; // Define a proper type for WebData if available
}

const ContactFormClient: React.FC<ContactFormClientProps> = ({ webData }) => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // EmailJS Configuration from environment variables
  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    if (!form.current) {
      setStatus({ type: "error", message: "Form reference is missing." });
      setIsLoading(false);
      return;
    }

    try {
      const result = await emailjs.sendForm(
        SERVICE_ID || '',
        TEMPLATE_ID || '',
        form.current,
        PUBLIC_KEY || ''
      );

      console.log("Email sent successfully:", result.text);
      setStatus({
        type: "success",
        message: "Message sent successfully! We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        user_name: "",
        user_email: "",
        message: "",
      });
      form.current.reset();
    } catch (error) {
      console.error("Email sending failed:", error);
      setStatus({
        type: "error",
        message:
          "Failed to send message. Please try again or contact us directly.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our products, need support, or want to partner with us? 
              We're here to help and would love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                {/* Store Email */}
                {webData?.contactInfo?.emailUs && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                      <p className="text-gray-600 mt-1">Get in touch for any inquiries</p>
                      <a 
                        href={`mailto:${webData.contactInfo.emailUs}`}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        {webData.contactInfo.emailUs}
                      </a>
                    </div>
                  </div>
                )}

                {/* Customer Support Phone */}
                {webData?.contactInfo?.callUs && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                      <p className="text-gray-600 mt-1">24/7 support for all customers</p>
                      <a 
                        href={`tel:${webData.contactInfo.callUs}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {webData.contactInfo.callUs}
                      </a>
                    </div>
                  </div>
                )}

                {/* Store Location */}
                {webData?.contactInfo?.visitUs && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Visit Our Store</h3>
                      <p className="text-gray-600 mt-1"
                        dangerouslySetInnerHTML={{ __html: webData.contactInfo.visitUs.replace(/\n/g, '<br />') }}
                      ></p>
                    </div>
                  </div>
                )}

                {/* Business Hours */}
                {webData?.contactInfo?.workingHours && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                      <p className="text-gray-600 mt-1"
                        dangerouslySetInnerHTML={{ __html: webData.contactInfo.workingHours.replace(/\n/g, '<br />') }}
                      ></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  {webData?.socialLinks?.linkedin && (
                    <a href={webData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors">
                      <Linkedin size={24} />
                    </a>
                  )}
                  {webData?.socialLinks?.github && (
                    <a href={webData.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                      <Github size={24} />
                    </a>
                  )}
                  {webData?.socialLinks?.instagram && (
                    <a href={webData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
                      <Instagram size={24} />
                    </a>
                  )}
                  {webData?.socialLinks?.facebook && (
                    <a href={webData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                      <Facebook size={24} />
                    </a>
                  )}
                  {webData?.socialLinks?.youtube && (
                    <a href={webData.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">
                      <Youtube size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
              
              <form ref={form} className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    placeholder="Your full name"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    placeholder="your.email@example.com"
                    value={formData.user_email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                {status.message && (
                  <div className={`p-4 rounded-lg ${ 
                    status.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${ 
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-200'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <CartMenu />
    </>
  );
};

export default ContactFormClient;

"use client"
import React, { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, ShoppingBag, Truck, CreditCard, HeadphonesIcon, User, Percent } from 'lucide-react';
import Header from "@/components/header/Header";
import CartMenu from "@/components/common/CartMenu";

const ContactPage = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Simulate form submission (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        user_name: "",
        user_email: "",
        user_phone: "",
        subject: "",
        message: "",
      });
      
      if (form.current) {
        form.current.reset();
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again or contact us directly.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
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
                      href="mailto:support@yourstore.com" 
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      support@yourstore.com
                    </a>
                  </div>
                </div>

                {/* Customer Support */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <HeadphonesIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Customer Support</h3>
                    <p className="text-gray-600 mt-1">24/7 support for all customers</p>
                    <a 
                      href="tel:+1-800-SUPPORT" 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      +1-800-SUPPORT
                    </a>
                  </div>
                </div>

                {/* Store Location */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Visit Our Store</h3>
                    <p className="text-gray-600 mt-1">
                      123 Commerce Street<br />
                      Shopping District, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                    <div className="text-gray-600 mt-1 space-y-1">
                      <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                      <p>Saturday: 10:00 AM - 6:00 PM</p>
                      <p>Sunday: 12:00 PM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a href="/shop" className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shop Now</span>
                  </a>
                  <a href="/deals" className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                    <Percent className="w-4 h-4" />
                    <span>Deals</span>
                  </a>
                  <a href="/account/orders" className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                    <Truck className="w-4 h-4" />
                    <span>Orders</span>
                  </a>
                  <a href="/account/account" className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                    <User className="w-4 h-4" />
                    <span>Account</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h2>
              
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="user_phone"
                      name="user_phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.user_phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Question</option>
                      <option value="return">Returns & Exchanges</option>
                      <option value="partnership">Business Partnership</option>
                      <option value="technical">Technical Support</option>
                    </select>
                  </div>
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
                  />
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

          {/* Additional Information */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <p className="text-gray-600">We're committed to providing the best shopping experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
                <p className="text-gray-600">Free shipping on orders over $50. Express delivery available.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Our customer support team is always here to help you.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
                <p className="text-gray-600">Safe and secure payment processing with multiple options.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CartMenu />
    </>
  );
};

export default ContactPage;

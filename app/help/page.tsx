import React from 'react';
import Container from '@/components/common/Container';
import { LifeBuoy, BookOpen, Shield, Phone, MessageSquare, Mail } from 'lucide-react';

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Help & Support Center
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your one-stop destination for assistance, guides, and contact information.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <a href="/faqs" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-200 block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <LifeBuoy className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
                  <p className="text-gray-600 text-sm">Find answers to common questions</p>
                </div>
              </div>
            </a>
            <a href="/terms" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-200 block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
                  <p className="text-gray-600 text-sm">Review our policies and guidelines</p>
                </div>
              </div>
            </a>
            <a href="/privacy" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-200 block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Privacy Policy</h3>
                  <p className="text-gray-600 text-sm">Learn how we protect your data</p>
                </div>
              </div>
            </a>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Contact Our Support Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Phone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 text-sm mb-2">Live support is available 24/7.</p>
                <a href="tel:+1-800-SUPPORT" className="text-orange-600 hover:underline">1-800-SUPPORT</a>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Mail className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm mb-2">We typically respond within 24 hours.</p>
                <a href="mailto:support@yourstore.com" className="text-orange-600 hover:underline">support@yourstore.com</a>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm mb-2">Chat with a support agent now.</p>
                <button className="text-orange-600 hover:underline">Start Chat</button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HelpPage;


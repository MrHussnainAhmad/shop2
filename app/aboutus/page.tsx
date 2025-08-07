import React from 'react';
import Container from '@/components/common/Container';
import { Award, Users, Globe, Heart, ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import { getWebData } from '@/lib/api';

const AboutUsPage = async () => {
  const webData = await getWebData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Our Store
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: webData?.aboutUs?.replace(/\n/g, '<br />') || "We're passionate about bringing you the finest products with exceptional service. Our journey began with a simple mission: to make quality shopping accessible to everyone." }}
          ></p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p dangerouslySetInnerHTML={{ __html: webData?.aboutUs?.replace(/\n/g, '<br />') || "Founded in 2020, our company started as a small family business with a big dream: to create an online shopping experience that combines quality products, competitive prices, and outstanding customer service." }}></p>
              <p dangerouslySetInnerHTML={{ __html: webData?.aboutUs?.replace(/\n/g, '<br />') || "What began as a passion project has grown into a trusted destination for thousands of customers worldwide. We've carefully curated our product selection to ensure every item meets our high standards for quality, value, and customer satisfaction." }}></p>
              <p dangerouslySetInnerHTML={{ __html: webData?.aboutUs?.replace(/\n/g, '<br />') || "Today, we continue to be driven by the same values that started our journey: integrity, quality, and putting our customers first in everything we do." }}></p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">50K+</div>
                <div className="text-gray-700">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">10K+</div>
                <div className="text-gray-700">Products Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">4.8★</div>
                <div className="text-gray-700">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">99%</div>
                <div className="text-gray-700">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600 text-sm">
                Every decision we make is centered around providing the best possible experience for our customers.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quality Assurance</h3>
              <p className="text-gray-600 text-sm">
                We rigorously test and curate every product to ensure it meets our high standards of quality.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                We're committed to environmentally responsible practices and supporting sustainable brands.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600 text-sm">
                We believe in building strong relationships with our customers, partners, and local communities.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <ShoppingBag className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Curated Selection</h3>
              <p className="text-gray-600 text-sm">
                Hand-picked products from trusted brands and suppliers worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600 text-sm">
                Quick and reliable delivery with real-time tracking for your peace of mind.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Shopping</h3>
              <p className="text-gray-600 text-sm">
                Your data and payments are protected with industry-leading security measures.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">
                Our dedicated customer service team is always here to help you.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop with Us?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers and discover why they choose us for their shopping needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/shop" 
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Shopping
            </a>
            <a 
              href="/contactus" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutUsPage;

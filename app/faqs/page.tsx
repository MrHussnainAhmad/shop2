"use client";
import React, { useState } from 'react';
import Container from '@/components/common/Container';
import { ChevronDown, ChevronUp, Search, Package, CreditCard, Truck, RefreshCw, HelpCircle, Shield } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqs: FAQ[] = [
    // Shopping & Orders
    {
      id: 1,
      question: "How do I place an order?",
      answer: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in, provide shipping information, and complete payment to finalize your order.",
      category: "shopping"
    },
    {
      id: 2,
      question: "Can I modify or cancel my order after placing it?",
      answer: "You can modify or cancel your order within 1 hour of placing it by contacting our customer service team. After this time, we may have already processed your order for shipping and changes may not be possible.",
      category: "shopping"
    },
    {
      id: 3,
      question: "Do you offer guest checkout?",
      answer: "Yes, we offer guest checkout for your convenience. However, creating an account allows you to track orders, save addresses, view order history, and receive exclusive offers.",
      category: "shopping"
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and shop pay. All payments are processed securely through encrypted connections.",
      category: "payment"
    },
    {
      id: 5,
      question: "Is it safe to shop on your website?",
      answer: "Absolutely! We use industry-standard SSL encryption to protect your personal and payment information. Our website is PCI DSS compliant, and we never store your credit card information on our servers.",
      category: "payment"
    },
    {
      id: 6,
      question: "Why was my payment declined?",
      answer: "Payment declines can occur for various reasons including insufficient funds, incorrect billing information, or bank security measures. Please verify your payment details and contact your bank if the issue persists.",
      category: "payment"
    },
    // Shipping
    {
      id: 7,
      question: "What are your shipping options and costs?",
      answer: "We offer standard shipping (3-7 business days, $5.99), expedited shipping (2-3 business days, $9.99), and overnight shipping ($19.99). Free standard shipping is available on orders over $75.",
      category: "shipping"
    },
    {
      id: 8,
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by destination. Customs duties and taxes may apply and are the responsibility of the recipient.",
      category: "shipping"
    },
    {
      id: 9,
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history. Tracking information is typically available within 24 hours of shipment.",
      category: "shipping"
    },
    {
      id: 10,
      question: "My package was damaged during shipping. What should I do?",
      answer: "We're sorry to hear about the damage! Please contact us immediately with photos of the damaged package and items. We'll work with you to resolve the issue quickly, either through a replacement or full refund.",
      category: "shipping"
    },
    // Returns & Exchanges
    {
      id: 11,
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unused, in original condition with tags attached, and in original packaging. Some items like personalized products, perishables, and intimate items are not returnable.",
      category: "returns"
    },
    {
      id: 12,
      question: "How do I initiate a return?",
      answer: "To start a return, log into your account, go to 'Order History,' select the order and items you want to return, and follow the prompts. You'll receive a prepaid return label and instructions via email.",
      category: "returns"
    },
    {
      id: 13,
      question: "When will I receive my refund?",
      answer: "Refunds are processed within 3-5 business days after we receive your returned items. The refund will be credited to your original payment method. Bank processing times may vary (typically 5-10 business days).",
      category: "returns"
    },
    {
      id: 14,
      question: "Can I exchange an item for a different size or color?",
      answer: "Yes! You can exchange items for a different size or color within 30 days of purchase. The exchange process is the same as returns - just indicate your preference when initiating the return.",
      category: "returns"
    },
    // Account & Support
    {
      id: 15,
      question: "How do I create an account?",
      answer: "Click 'Sign Up' at the top of any page and provide your email address and create a password. You can also sign up using your Google or Facebook account for faster registration.",
      category: "account"
    },
    {
      id: 16,
      question: "I forgot my password. How can I reset it?",
      answer: "Click 'Forgot Password' on the sign-in page and enter your email address. We'll send you a secure link to reset your password. If you don't receive the email, check your spam folder.",
      category: "account"
    },
    {
      id: 17,
      question: "How can I update my account information?",
      answer: "Log into your account and go to 'Account Settings' where you can update your personal information, shipping addresses, payment methods, and communication preferences.",
      category: "account"
    },
    {
      id: 18,
      question: "How do I contact customer service?",
      answer: "You can reach our customer service team via email at support@yourstore.com, phone at 1-800-SUPPORT (available 24/7), or through our live chat feature on the website. We typically respond to emails within 24 hours.",
      category: "support"
    },
    {
      id: 19,
      question: "Do you offer price matching?",
      answer: "Yes, we offer price matching on identical items from authorized retailers. The item must be in stock at both locations, and you must provide proof of the lower price. Some exclusions apply.",
      category: "support"
    },
    {
      id: 20,
      question: "How do I leave a product review?",
      answer: "You can leave a review by going to the product page and clicking 'Write a Review.' You must have purchased the item to leave a review. We appreciate honest feedback from our customers!",
      category: "support"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'shopping', name: 'Shopping & Orders', icon: Package },
    { id: 'payment', name: 'Payment & Security', icon: CreditCard },
    { id: 'shipping', name: 'Shipping & Delivery', icon: Truck },
    { id: 'returns', name: 'Returns & Exchanges', icon: RefreshCw },
    { id: 'account', name: 'Account & Profile', icon: Shield },
    { id: 'support', name: 'Customer Support', icon: HelpCircle }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our products, services, and policies.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => {
              const isExpanded = expandedItems.includes(faq.id);
              return (
                <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any FAQs matching your search. Try different keywords or browse all categories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Show All FAQs
              </button>
            </div>
          )}

          {/* Contact Support */}
          <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-lg mb-6 opacity-90">
              Can't find the answer you're looking for? Our customer support team is here to help 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contactus" 
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </a>
              <a 
                href="tel:+1-800-SUPPORT" 
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FAQsPage;


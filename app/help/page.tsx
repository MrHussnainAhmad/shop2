import React from 'react';
import Container from '@/components/common/Container';

const HelpPage = () => {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-lg text-gray-600">
            Here you can find answers to your questions and receive support.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Management</h2>
              <p className="text-gray-700 leading-relaxed">
                Learn how to manage your account settings, update your profile, and control your preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ordering & Shipping</h2>
              <p className="text-gray-700 leading-relaxed">
                Find out how to place an order, track your shipment, and handle delivery issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment & Billing</h2>
              <p className="text-gray-700 leading-relaxed">
                Get information on accepted payment methods, billing inquiries, and resolving payment problems.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Support</h2>
              <p className="text-gray-700 leading-relaxed">
                Access troubleshooting guides and technical support for website-related issues.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contacting Support</h2>
              <p className="text-gray-700 leading-relaxed">
                Our support team is here to help. Contact us via email at support@yourstore.com or by phone at +1 (555) 123-4567.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HelpPage;


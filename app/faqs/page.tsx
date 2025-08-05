import React from 'react';
import Container from '@/components/common/Container';

const FaqsPage = () => {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our services.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is our return policy?</h2>
              <p className="text-gray-700 leading-relaxed">
                We offer a 30-day return policy on most items. Items must be returned in their original condition and 
                packaging. Customers are responsible for return shipping costs. Refunds will be processed within 
                5-7 business days after receiving the returned item.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How can I track my order?</h2>
              <p className="text-gray-700 leading-relaxed">
                Once your order has shipped, you will receive a confirmation email with a tracking number. 
                You can use this number to track your order on the carrier's website. If you have an account, 
                you can also track your order through your account dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Do you offer international shipping?</h2>
              <p className="text-gray-700 leading-relaxed">
                Yes, we offer international shipping to select countries. Shipping rates and delivery times vary based on the destination.
                Additional customs fees and duties may apply, and customers are responsible for these charges. Please contact 
                our customer service team for more details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Can I change or cancel my order?</h2>
              <p className="text-gray-700 leading-relaxed">
                If your order has not yet shipped, you may be able to change or cancel it by contacting our customer service team. 
                Once the order has shipped, we are unable to make changes or cancellations. In this case, you may return the item 
                after receiving it, following our return policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How can I contact customer support?</h2>
              <p className="text-gray-700 leading-relaxed">
                Our customer support team is available Monday through Friday, from 9:00 AM to 6:00 PM. You can contact us 
                via email at support@yourstore.com or by phone at +1 (555) 123-4567.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FaqsPage;


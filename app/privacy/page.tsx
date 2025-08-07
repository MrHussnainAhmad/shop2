"use client"
import React from 'react';
import Container from '@/components/common/Container';
import { getWebData } from '@/lib/api';

const PrivacyPage = async () => {
  const webData = await getWebData();

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: webData?.privacy?.replace(/\n/g, '<br />') || "No privacy policy available." }}
              ></p>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PrivacyPage;

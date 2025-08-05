import React from 'react';
import Container from '@/components/common/Container';

const TermsPage = () => {
  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials on our website for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                <li>attempt to decompile or reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Disclaimer</h2>
              <p className="text-gray-700 leading-relaxed">
                The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, 
                and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions 
                of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Limitations</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall our company or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use the materials on our website, even if we or our authorized representative has been notified orally 
                or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on 
                implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Accuracy of Materials</h2>
              <p className="text-gray-700 leading-relaxed">
                The materials appearing on our website could include technical, typographical, or photographic errors. 
                We do not warrant that any of the materials on its website are accurate, complete, or current. 
                We may make changes to the materials contained on its website at any time without notice. 
                However, we do not make any commitment to update the materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Links</h2>
              <p className="text-gray-700 leading-relaxed">
                We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. 
                The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Modifications</h2>
              <p className="text-gray-700 leading-relaxed">
                We may revise these terms of service for its website at any time without notice. 
                By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably 
                submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">Email: legal@yourstore.com</p>
                <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
                <p className="text-gray-700">Address: 123 Business Street, Suite 456, City, State 12345</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TermsPage;

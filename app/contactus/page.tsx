import React from 'react';
import { getWebData } from '@/lib/api';
import ContactFormClient from '@/components/pages/contactus/ContactFormClient';

const ContactPage = async () => {
  const webData = await getWebData();

  return (
    <ContactFormClient webData={webData} />
  );
};

export default ContactPage;
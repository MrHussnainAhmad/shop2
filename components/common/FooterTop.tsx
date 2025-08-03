import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";
interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}
const data: ContactItemData[] = [
  {
    title: "Visit Us",
    subtitle: "Location",
    icon: (
      <MapPin className="h-6 w-6 text-gray-500 group-hover:text-red-500 transform-colors" />
    ),
  },
  {
    title: "Call Us",
    subtitle: "+123456789",
    icon: (
      <Phone className="h-6 w-6 text-gray-500 group-hover:text-red-500 transform-colors" />
    ),
  },
  {
    title: "Email Us",
    subtitle: "info@example.com",
    icon: (
      <Mail className="h-6 w-6 text-gray-500 group-hover:text-red-500 transform-colors" />
    ),
  },
  {
    title: "Working Hours",
    subtitle: "Mon - Fri: 9am - 5pm",
    icon: (
      <Clock className="h-6 w-6 text-gray-500 group-hover:text-red-500 transform-colors" />
    ),
  },
];
const FooterTop = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {data.map((item, index) => (
        <ContactItem
          key={index}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
        />
      ))}
    </div>
  );
};

interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const ContactItem = ({ icon, title, subtitle }: ContactItemProps) => {
  return (
    <div className="flex items-center gap-3 group p-4 transition-colors">
      {icon}
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mt-1 group-hover:text-gray-500 transition-colors">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default FooterTop;

import React from 'react';
import { MapPin } from 'lucide-react';
import { Address } from '@/hooks/useAddresses';

interface AddressCardProps {
  address: Address;
  showChangeLink?: boolean;
  className?: string;
}

const AddressCard: React.FC<AddressCardProps> = ({ 
  address, 
  showChangeLink = false, 
  className = "" 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="font-medium text-gray-900">{address.name}</p>
      <p className="text-sm text-gray-600">{address.streetAddress}</p>
      {address.apartment && (
        <p className="text-sm text-gray-600">{address.apartment}</p>
      )}
      <p className="text-sm text-gray-600">
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p className="text-sm text-gray-600">{address.country}</p>
      <p className="text-sm text-gray-600">{address.phone}</p>
      
      {showChangeLink && (
        <a 
          href="/account/addresses" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors inline-flex items-center gap-1 mt-2"
        >
          Change Address
        </a>
      )}
    </div>
  );
};

export default AddressCard;

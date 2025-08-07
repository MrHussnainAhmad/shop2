import React from 'react';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import { UserCircle } from 'lucide-react';

interface AdminHeaderProps {
  logo?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ logo }) => {
  return (
    <header className="bg-gray-900 text-white p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Logo headerLogo={logo} />
        <h1 className="text-xl font-semibold">Admin Panel</h1>
      </div>
      <Link href="/admin/account" className="flex items-center space-x-2 hover:text-gray-300">
        <UserCircle size={24} />
        <span>Admin</span>
      </Link>
    </header>
  );
};

export default AdminHeader;

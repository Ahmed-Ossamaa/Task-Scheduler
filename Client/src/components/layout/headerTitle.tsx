'use client';

import { getPageTitle } from '@/constants/sidebar-menu-items-constant';
import { usePathname } from 'next/navigation';


export default function HeaderTitle() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return <span className="font-semibold">{title}</span>;
}
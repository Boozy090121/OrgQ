import { Sidebar as OriginalSidebar } from '@/components/layout/Sidebar';

// Add the new navigation items to the sidebar
export function Sidebar() {
  return (
    <OriginalSidebar
      items={[
        { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { name: 'Organization', href: '/dashboard/organization', icon: 'organization' },
        { name: 'Timeline', href: '/dashboard/timeline', icon: 'timeline' },
        { name: 'Budget', href: '/dashboard/budget', icon: 'budget' },
        { name: 'Resources', href: '/dashboard/resources', icon: 'resources' },
        { name: 'Personnel', href: '/dashboard/personnel', icon: 'personnel' },
        { name: 'Clients', href: '/dashboard/clients', icon: 'clients' },
        { name: 'Departments', href: '/dashboard/departments', icon: 'departments' },
        { name: 'Factories', href: '/dashboard/factories', icon: 'factory' },
        { name: 'Admin', href: '/dashboard/admin', icon: 'admin' },
      ]}
    />
  );
}

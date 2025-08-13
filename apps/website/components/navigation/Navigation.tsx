import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItemProps {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavigationProps {
  navItems: NavigationItemProps[];
}

export default function Navigation({ navItems }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            pathname === item.href
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {item.icon}
          <span className="ml-3">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
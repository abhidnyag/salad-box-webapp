import Link from 'next/link';

const footerLinks = [
  { title: 'Company', links: [{ label: 'About Us', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Blog', href: '#' }] },
  { title: 'Support', links: [{ label: 'Help Center', href: '#' }, { label: 'Contact', href: '#' }, { label: 'FAQs', href: '#' }] },
  { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Cookies', href: '#' }] },
];

export function Footer() {
  return (
    <footer className="bg-brand-green-dark text-white mt-16">
      <div className="max-w-[1400px] 2xl:max-w-[1680px] 3xl:max-w-[1840px] mx-auto px-6 lg:px-8 xl:px-12 2xl:px-16 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-2">SaladBox</h3>
          <p className="text-brand-green-pale text-sm">Fresh salad &amp; sandwich kits delivered to your door.</p>
          <p className="text-brand-green-pale/60 text-xs mt-4">© {new Date().getFullYear()} SaladBox</p>
        </div>
        {footerLinks.map(group => (
          <div key={group.title}>
            <h4 className="font-semibold text-sm mb-3">{group.title}</h4>
            <ul className="space-y-2">
              {group.links.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-brand-green-pale hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

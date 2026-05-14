import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/export', label: 'Export' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/onboarding', label: 'Onboarding' },
];

interface NavBarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function NavBar({ theme, onToggleTheme }: NavBarProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-30 mx-auto flex w-full max-w-7xl items-center justify-between gap-6 border-b border-white/10 bg-[#020617]/95 px-6 py-4 backdrop-blur-xl"
    >
      <Link to="/" className="flex items-center gap-3 text-white">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-cyber/15 text-lg font-bold text-cyber">S</span>
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">SyntheticAI</p>
          <p className="text-base font-semibold">Premium AI Launch Studio</p>
        </div>
      </Link>
      <nav className="hidden items-center gap-6 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`text-sm font-medium transition ${location.pathname === link.href ? 'text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="hidden items-center gap-3 md:flex">
        <Button variant="ghost" size="sm" onClick={onToggleTheme} className="border border-white/10 text-slate-200 hover:border-cyan-400/40">
          {theme === 'dark' ? 'Light' : 'Dark'} mode
        </Button>
        {user ? (
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="border border-white/10 text-slate-200 hover:border-cyan-400/40">
            Sign out
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="primary" size="sm">Sign in</Button>
          </Link>
        )}
      </div>
    </motion.header>
  );
}

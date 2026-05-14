import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface FormErrors {
  email?: string;
  password?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | undefined {
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return undefined;
}

function validatePassword(password: string, isSignUp: boolean): string | undefined {
  if (!password) return 'Password is required';
  if (isSignUp && password.length < 8) return 'Password must be at least 8 characters';
  return undefined;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { signIn, signUp } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    
    const passwordError = validatePassword(password, isSignUp);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        addToast('Check your email for the confirmation link', 'success');
      } else {
        await signIn(email, password);
        addToast('Welcome back!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setErrors({});
    setIsSignUp(!isSignUp);
  };

  return (
    <main className="px-6 pb-16 pt-12 sm:px-10 lg:px-12">
      <section className="mx-auto max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-white">
              {isSignUp ? 'Create account' : 'Sign in'}
            </h1>
            <p className="mt-2 text-slate-300">
              {isSignUp ? 'Join SyntheticAI to start building' : 'Welcome back to your launch studio'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                onBlur={() => {
                  const error = validateEmail(email);
                  if (error) setErrors({ ...errors, email: error });
                  else setErrors({ ...errors, email: undefined });
                }}
                required
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                label="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                onBlur={() => {
                  const error = validatePassword(password, isSignUp);
                  if (error) setErrors({ ...errors, password: error });
                  else setErrors({ ...errors, password: undefined });
                }}
                required
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              loading={loading} 
              className="w-full"
              disabled={loading || !email || !password}
            >
              {isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-sm text-cyan-200 hover:text-cyan-100 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              ← Back to home
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
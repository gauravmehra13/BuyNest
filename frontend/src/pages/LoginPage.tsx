import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { theme, commonClasses } from '../styles/theme';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${commonClasses.pageContainer} ${commonClasses.flexCenter} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className={commonClasses.flexCenter + " space-x-2 mb-6"}>
            <div className={theme.gradients.primary + " w-10 h-10 rounded-lg flex items-center justify-center"}>
              <span className="text-white font-bold">B</span>
            </div>
            <span className={`text-2xl ${theme.text.heading}`}>BuyNest</span>
          </Link>

          <h2 className={`mt-6 text-center text-3xl font-extrabold ${theme.text.heading}`}>
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className={theme.text.link}>
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${theme.text.heading}`}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={theme.input.base}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${theme.text.heading}`}>
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={theme.input.base}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className={commonClasses.flexBetween}>
            <div className={commonClasses.flexVerticalCenter}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className={`ml-2 block text-sm ${theme.text.heading}`}>
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className={theme.text.link}>
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${theme.button.primary} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
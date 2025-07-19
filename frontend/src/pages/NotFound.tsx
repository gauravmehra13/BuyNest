import { Link } from 'react-router-dom';
import { Home, ShoppingBag, MoveLeft } from 'lucide-react';
import { theme } from '../styles/theme';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <svg
            className="w-full max-w-lg mx-auto"
            viewBox="0 0 500 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M30 95h30V35h-30v60zm15-25a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
              className="fill-primary-600"
            />
            <path
              d="M140 95V35h-30v60h30zm-15-25a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
              className="fill-secondary-600"
            />
            <path
              d="M245 95c16.6 0 30-13.4 30-30s-13.4-30-30-30-30 13.4-30 30 13.4 30 30 30z"
              className="fill-primary-600"
            />
          </svg>
        </div>

        <h1 className={`text-6xl font-bold ${theme.text.heading} mb-4`}>Page Not Found</h1>
        
        <p className={`${theme.text.body} text-lg mb-8 max-w-md mx-auto`}>
          Oops! Looks like you've ventured into uncharted territory. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/products" 
            className={`${theme.button.primary} inline-flex items-center justify-center gap-2`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>

          <Link 
            to="/" 
            className={`${theme.button.secondary} inline-flex items-center justify-center gap-2`}
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <button 
          onClick={() => window.history.back()}
          className={`mt-8 ${theme.text.link} inline-flex items-center gap-2`}
        >
          <MoveLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
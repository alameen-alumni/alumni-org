import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSwitch }: { onSwitch: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.admin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-teal-600 text-white p-2.5 text-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-indigo-100 mt-1">Sign in to your alumni account</p>
      </div>
      <div className="w-full max-w-lg mx-auto my-4 p-4  bg-white overflow-y-auto">
        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-indigo-400" size={20} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-indigo-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-indigo-400 hover:text-indigo-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end">
            
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700">Forgot password?</a>
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-indigo-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitch}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm; 
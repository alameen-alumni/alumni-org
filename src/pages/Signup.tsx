import { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup = ({ onSwitch }: { onSwitch: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    graduationYear: '',
    mobile: '',
    reg_id: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      await signup(
        form.email,
        form.password,
        form.fullName,
        {
          mobile: form.mobile,
          name: form.fullName,
          passout_year: Number(form.graduationYear) || undefined,
          reg_id: Number(form.reg_id) || undefined,
        }
      );
    } catch (err: any) {
      setError(err.message || 'Signup failed');
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
        <h1 className="text-2xl font-bold">Join Our Community</h1>
        <p className="text-indigo-100 mt-1">Create your alumni account</p>
      </div>
      <div className="flex-1 md:px-6 py-2 px-4 overflow-y-auto">
        <form className="space-y-2.5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-indigo-400" size={20} />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-teal-700 mb-1.5">Passout Year</label>
              <select
                name="graduationYear"
                value={form.graduationYear}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Select graduation year</option>
                {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-teal-700 mb-1.5">Registration ID</label>
              <input
                type="text"
                name="reg_id"
                value={form.reg_id}
                onChange={handleChange}
                placeholder="Enter your registration ID"
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
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
            <div className="flex-1">
              <label className="block text-sm font-medium text-indigo-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-indigo-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
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
            <span>Sign up with Google</span>
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-indigo-600">
            Already have an account?{' '}
            <button
              onClick={onSwitch}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup; 
import { useState, type ChangeEvent, type FormEvent, type MouseEvent } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { type LoginFormProps, type LoginFormData } from '../../types';

const LoginForm = ({
  form,
  loading,
  error,
  onFormChange,
  onSubmit,
  onForgotPassword
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-2.5" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-medium text-indigo-700 mb-1.5">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-indigo-400" size={20} />
          <input
            type="text"
            name="email"
            value={form.email}
            onChange={onFormChange}
            placeholder="Enter your email or registration ID"
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
            onChange={onFormChange}
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
        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700" onClick={onForgotPassword}>Forgot password?</a>
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
  );
};

export default LoginForm; 
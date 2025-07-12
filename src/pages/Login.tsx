
import Signup from './Signup';
import LoginForm from './LoginForm';
import { useState } from 'react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center py-3 px-4 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-44"
        style={{ backgroundImage: `url('/msn2.png')` }}
      ></div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/50"></div>
      <div className="w-full max-w-2xl md:rounded-lg md:shadow-xl bg-white overflow-hidden relative z-10 md:mx-0 mx-2 md:h-auto h-full flex flex-col justify-center">
        {isLogin ? (
          <LoginForm onSwitch={() => setIsLogin(false)} />
        ) : (
          <Signup onSwitch={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default Login;

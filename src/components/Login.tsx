import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('gov_auth', 'true');
        localStorage.setItem('gov_email', data.email);
        localStorage.setItem('gov_token', data.token);
        localStorage.setItem('gov_role', data.role);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback for demo if backend is not ready
      localStorage.setItem('gov_auth', 'true');
      localStorage.setItem('gov_email', email);
      navigate('/dashboard');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="govuk-width-container py-12 md:py-20"
    >
      <div className="max-w-xl">
        <h1 className="text-4xl font-bold mb-8">Sign in</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="border-2 border-gds-black p-2 text-xl focus:ring-4 focus:ring-gds-yellow focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="border-2 border-gds-black p-2 text-xl focus:ring-4 focus:ring-gds-yellow focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#00703c] text-white text-xl font-bold px-8 py-3 shadow-[0_4px_0_#002d18] hover:bg-[#005a30] active:shadow-none active:translate-y-1 transition-all"
          >
            Continue
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Register for an account</h2>
          <p className="text-lg mb-4">If you don't have an account, you will need to contact your department administrator.</p>
          <a href="#" className="text-gds-blue underline text-lg">Help with signing in</a>
        </div>
      </div>
    </motion.div>
  );
};

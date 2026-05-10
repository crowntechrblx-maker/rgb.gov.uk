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
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
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
      } else {
        const text = await response.text();
        console.error("Server returned non-JSON response:", text);
        alert("Server error: Received invalid response from portal. Please try again later.");
      }
    } catch (err) {
      console.error('Login error:', err);
      alert("Network error: Could not connect to the government portal.");
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

        {/* Public Login Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Public Account</h2>
          <p className="text-lg mb-6 text-gds-dark-grey">
            Sign in as a member of the public to follow bills, track petitions, and manage your preferences.
          </p>
          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gds-black p-3 text-xl font-bold hover:bg-gray-100 transition-all hover:shadow-[4px_4px_0_#0b0c0c]"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </a>
        </section>

        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 font-bold text-gray-500 uppercase tracking-widest">OR</span>
          </div>
        </div>

        {/* Staff Login Section */}
        <section className="bg-gds-grey border-l-8 border-gds-black p-8">
          <h2 className="text-2xl font-bold mb-4">Staff & MPs Portal</h2>
          <p className="text-lg mb-8">
            Access for Clerks, Members of Parliament, and System Administrators using official credentials.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold" htmlFor="email">
                Staff Email address
              </label>
              <input
                id="email"
                type="email"
                className="border-2 border-gds-black p-2 text-lg bg-white focus:ring-4 focus:ring-gds-yellow focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold" htmlFor="password">
                Staff Password
              </label>
              <input
                id="password"
                type="password"
                className="border-2 border-gds-black p-2 text-lg bg-white focus:ring-4 focus:ring-gds-yellow focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#00703c] text-white text-lg font-bold px-8 py-3 shadow-[0_4px_0_#002d18] hover:bg-[#005a30] active:shadow-none active:translate-y-1 transition-all"
            >
              Sign in to Staff Portal
            </button>
          </form>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gds-dark-grey">
          <p>By signing in, you agree to the <a href="/terms" className="underline hover:text-gds-blue">Terms of Use</a> and <a href="/privacy" className="underline hover:text-gds-blue">Privacy Policy</a>.</p>
        </div>
      </div>
    </motion.div>
  );
};

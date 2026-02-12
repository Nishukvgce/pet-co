import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const LoginModal = ({ onClose }) => {
  const [view, setView] = useState('choice') // 'choice' | 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  // login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // register fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const handleLogin = async () => {
    setError(null)
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    if (result.error) {
      setError(result.error.message || 'Login failed')
    } else {
      onClose && onClose()
    }
  }

  const handleRegister = async () => {
    setError(null)
    setLoading(true)
    const payload = { name, email: regEmail, password: regPassword, phone }
    const result = await signUp(payload)
    setLoading(false)
    if (result.error) {
      setError(result.error.message || 'Registration failed')
    } else {
      onClose && onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-lg hover:text-gray-400"
        >
          &times;
        </button>

        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">Pet and Co</h2>
          <p className="text-sm text-gray-400">Register to avail the best deals!</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <span className="text-yellow-400 text-lg">★</span>
            <p className="text-sm">Exclusive Deals and Discount</p>
          </div>
          <div className="text-center">
            <span className="text-yellow-400 text-lg">★</span>
            <p className="text-sm">Swift Checkout Experience</p>
          </div>
          <div className="text-center">
            <span className="text-yellow-400 text-lg">★</span>
            <p className="text-sm">Easy Orders Tracking</p>
          </div>
        </div>

        {view === 'choice' && (
          <div className="space-y-4">
            <p className="text-center">Are you a new user?</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigate('/user-login')
                  onClose && onClose()
                }}
                className="flex-1 bg-blue-500 text-white rounded-lg px-4 py-2"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/user-register')
                  onClose && onClose()
                }}
                className="flex-1 bg-green-500 text-white rounded-lg px-4 py-2"
              >
                Register
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center"></p>
          </div>
        )}

        {view === 'login' && (
          <div>
            <label className="block text-sm mb-2">Login</label>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
              />
            </div>
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-500 text-white rounded-lg px-4 py-2"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-xs text-gray-400 mt-4 text-center">
              <button onClick={() => setView('choice')} className="text-blue-400 hover:underline">Back</button>
            </p>
          </div>
        )}

        {view === 'register' && (
          <div>
            <label className="block text-sm mb-2">Register</label>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="mb-3">
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
              />
            </div>
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-green-500 text-white rounded-lg px-4 py-2"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <p className="text-xs text-gray-400 mt-4 text-center">
              <button onClick={() => setView('choice')} className="text-blue-400 hover:underline">Back</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
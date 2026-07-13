import React, { useState } from 'react';
import { login as apiLogin, register as apiRegister } from './api';
import { useAuth } from './AuthContext';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('demo@test.com');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isRegistering) {
        result = await apiRegister(email, password, name);
      } else {
        result = await apiLogin(email, password);
      }

      if (result.error) {
        setError(result.error);
      } else {
        login(result.token, result.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Terra-ser Influence Intelligence</h1>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isRegistering}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <p>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="toggle-btn"
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>

        <p className="demo-hint">Demo: demo@test.com / demo123</p>
      </div>
    </div>
  );
}

export default Login;

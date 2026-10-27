import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Lock, Mail, User, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page py-5 my-auto d-flex align-items-center">
      <div className="container" style={{ maxWidth: 460 }}>
        <div className="glass-panel p-4 p-md-5">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3 shadow"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 0 25px rgba(37, 99, 235, 0.45)',
              }}
            >
              <Film size={26} color="#ffffff" />
            </div>
            <h3 className="text-white fw-bold mb-1 fs-3">Join iMovies</h3>
            <p className="text-secondary small">
              Create an account for seamless cinema seat reservations.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 small rounded-3" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-secondary small">Full Name</label>
              <div className="position-relative">
                <User size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
                <input
                  type="text"
                  className="form-control form-control-cinema ps-5"
                  placeholder="e.g. Alex Sterling"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small">Email Address</label>
              <div className="position-relative">
                <Mail size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
                <input
                  type="email"
                  className="form-control form-control-cinema ps-5"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary small">Password (Min. 8 chars)</label>
              <div className="position-relative">
                <Lock size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control form-control-cinema ps-5 pe-5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-link text-secondary position-absolute top-50 end-0 translate-middle-y me-2 p-1 border-0"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary small">Confirm Password</label>
              <div className="position-relative">
                <Lock size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control form-control-cinema ps-5"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-cinema w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4 pt-2 border-top border-white border-opacity-10">
            <span className="text-secondary small">Already have an account? </span>
            <Link to="/login" className="text-primary small fw-bold text-decoration-none ms-1 hover-white">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

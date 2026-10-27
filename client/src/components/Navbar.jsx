import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Film,
  Ticket,
  User as UserIcon,
  Shield,
  LogOut,
  Compass,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Search,
  MapPin,
  Calendar,
  Tag,
  Flame,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [citySelectorOpen, setCitySelectorOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('New York, NY');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const cityRef = useRef(null);

  const cities = ['New York, NY', 'Los Angeles, CA', 'London, UK', 'Mumbai, IN', 'Bengaluru, IN'];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setCitySelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      setSearchModalOpen(false);
      navigate(`/movies?q=${encodeURIComponent(navSearchQuery.trim())}`);
      setNavSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="glass-nav-container">
      <div className="container-fluid px-3 px-xl-5">
        <header className="glass-nav-pill d-flex align-items-center justify-content-between position-relative py-2">
          {/* Brand Logo & Name */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #2563eb 0%, #0052cc 100%)',
                  boxShadow: '0 0 20px rgba(37, 99, 235, 0.65)',
                }}
              >
                <Film size={20} color="#ffffff" />
              </div>
              <div className="d-flex flex-column leading-none">
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}
                >
                  <span className="text-white">i</span>
                  <span style={{ color: 'var(--cinema-blue)' }}>Movies</span>
                </span>
                <span
                  className="text-uppercase tracking-widest text-secondary"
                  style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em' }}
                >
                  CINEMAS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Pills */}
            <nav className="d-none d-lg-flex align-items-center gap-1 bg-black bg-opacity-40 p-1 rounded-pill border border-white border-opacity-10 ms-2">
              <Link
                to="/movies"
                className={`px-3 py-1 rounded-pill text-decoration-none small fw-bold transition-all ${
                  isActive('/') || isActive('/movies')
                    ? 'btn-cinema text-white shadow-sm'
                    : 'text-secondary hover-text-white'
                }`}
              >
                Movies
              </Link>
              <Link
                to="/movies?format=cinemas"
                className="px-3 py-1 rounded-pill text-decoration-none small fw-semibold text-secondary hover-text-white"
              >
                Cinemas
              </Link>
              <Link
                to="/movies?genre=Sci-Fi"
                className="px-3 py-1 rounded-pill text-decoration-none small fw-semibold text-secondary hover-text-white d-flex align-items-center gap-1"
              >
                <Sparkles size={13} color="var(--cinema-cyan)" />
                <span>IMAX Experiences</span>
              </Link>
              <Link
                to="/movies?status=coming_soon"
                className="px-3 py-1 rounded-pill text-decoration-none small fw-semibold text-secondary hover-text-white"
              >
                Events
              </Link>
              <Link
                to="/my-bookings"
                className="px-3 py-1 rounded-pill text-decoration-none small fw-semibold text-secondary hover-text-white"
              >
                Offers
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-1 rounded-pill text-decoration-none small fw-bold transition-all d-flex align-items-center gap-1 ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-primary'
                  }`}
                >
                  <Shield size={14} />
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Right Header Controls (Search + Location + Auth + Ticket) */}
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            {/* Quick Search Trigger Pill */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="d-none d-md-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-black bg-opacity-40 border border-white border-opacity-10 text-secondary small hover-white"
              style={{ cursor: 'pointer' }}
            >
              <Search size={14} />
              <span style={{ fontSize: '0.82rem' }}>Search movies, halls...</span>
              <span
                className="badge bg-white bg-opacity-10 text-secondary border border-white border-opacity-10 ms-1"
                style={{ fontSize: '0.65rem', padding: '2px 6px' }}
              >
                Ctrl + K
              </span>
            </button>

            {/* Location Selector Dropdown */}
            <div className="position-relative d-none d-sm-block" ref={cityRef}>
              <button
                type="button"
                onClick={() => setCitySelectorOpen(!citySelectorOpen)}
                className="btn btn-link text-decoration-none p-1 d-flex align-items-center gap-1 text-light small border-0"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 24,
                    height: 24,
                    background: 'rgba(37, 99, 235, 0.18)',
                    color: 'var(--cinema-blue)',
                  }}
                >
                  <MapPin size={13} />
                </div>
                <span className="fw-semibold" style={{ fontSize: '0.82rem' }}>
                  {selectedCity}
                </span>
                <ChevronDown size={12} className="text-secondary" />
              </button>

              {citySelectorOpen && (
                <div
                  className="position-absolute end-0 mt-2 py-2 shadow-lg glass-panel-elevated"
                  style={{ minWidth: 180, zIndex: 1050, borderRadius: 14 }}
                >
                  <div className="px-3 py-1 text-secondary small fw-bold text-uppercase" style={{ fontSize: '0.68rem' }}>
                    Select Region
                  </div>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setCitySelectorOpen(false);
                      }}
                      className={`dropdown-item px-3 py-2 text-start small w-100 border-0 bg-transparent ${
                        selectedCity === city ? 'text-primary fw-bold' : 'text-light hover-white'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile / Sign In */}
            {isAuthenticated ? (
              <div className="position-relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="btn btn-cinema-outline btn-cinema-pill d-flex align-items-center gap-2 border-0 bg-white bg-opacity-10 py-1 px-3"
                  type="button"
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                      width: 26,
                      height: 26,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="fw-semibold text-white small d-none d-md-inline">{user?.name}</span>
                  {isAdmin && (
                    <span className="badge bg-primary ms-1" style={{ fontSize: '0.6rem' }}>
                      ADMIN
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className="text-secondary transition-all"
                    style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="position-absolute end-0 mt-2 py-2 shadow-lg glass-panel-elevated"
                    style={{
                      minWidth: 220,
                      zIndex: 1050,
                      borderRadius: 16,
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <div className="px-3 py-2 border-bottom border-white border-opacity-10 mb-1">
                      <p className="text-white small fw-bold m-0 text-truncate">{user?.name}</p>
                      <p className="text-secondary small m-0 text-truncate" style={{ fontSize: '0.75rem' }}>
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="d-flex align-items-center gap-2 px-3 py-2 text-white text-decoration-none small hover-white"
                    >
                      <Ticket size={16} color="var(--cinema-blue)" />
                      My Bookings
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="d-flex align-items-center gap-2 px-3 py-2 text-white text-decoration-none small hover-white"
                    >
                      <UserIcon size={16} color="var(--cinema-cyan)" />
                      Profile Settings
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="my-1 border-top border-white border-opacity-10"></div>
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="d-flex align-items-center gap-2 px-3 py-2 text-primary text-decoration-none small"
                        >
                          <Shield size={16} />
                          Admin Console
                        </Link>
                      </>
                    )}

                    <div className="my-1 border-top border-white border-opacity-10"></div>
                    <button
                      onClick={handleLogout}
                      className="d-flex align-items-center gap-2 px-3 py-2 text-danger w-100 border-0 bg-transparent text-start small"
                      style={{ cursor: 'pointer' }}
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="text-light small text-decoration-none fw-semibold px-2 hover-blue">
                  Sign In
                </Link>
              </div>
            )}

            {/* Quick Ticket Drawer Trigger Pill on Far Right */}
            <Link
              to="/my-bookings"
              className="btn btn-cinema d-flex align-items-center justify-content-center p-2 rounded-circle"
              style={{ width: 36, height: 36 }}
              title="My Bookings & Tickets"
            >
              <Ticket size={16} />
            </Link>

            {/* Mobile / Compact Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-link text-white p-1 d-lg-none border-0"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="d-lg-none glass-panel p-3 mt-2 rounded-4">
            <div className="d-flex flex-column gap-2">
              <Link
                to="/"
                className={`p-2 rounded-3 text-decoration-none fw-semibold ${
                  isActive('/') ? 'bg-primary bg-opacity-25 text-white' : 'text-secondary'
                }`}
              >
                Movies (Premieres)
              </Link>
              <Link
                to="/movies"
                className={`p-2 rounded-3 text-decoration-none fw-semibold d-flex align-items-center gap-2 ${
                  isActive('/movies') ? 'bg-primary bg-opacity-25 text-white' : 'text-secondary'
                }`}
              >
                <Compass size={16} />
                Explore All Shows
              </Link>
              <Link
                to="/movies?genre=Sci-Fi"
                className="p-2 rounded-3 text-decoration-none fw-semibold text-secondary d-flex align-items-center gap-2"
              >
                <Sparkles size={16} color="var(--cinema-cyan)" />
                IMAX Experiences
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="p-2 rounded-3 text-decoration-none fw-semibold text-primary d-flex align-items-center gap-2"
                >
                  <Shield size={16} />
                  Admin Console
                </Link>
              )}
              <hr className="my-1 border-white border-opacity-10" />
              <Link
                to="/my-bookings"
                className="p-2 rounded-3 text-decoration-none fw-semibold text-white d-flex align-items-center gap-2"
              >
                <Ticket size={16} color="var(--cinema-blue)" />
                My Bookings & Tickets
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Global Quick Search Modal (Ctrl + K) */}
      {searchModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start justify-content-center pt-5 p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1070 }}
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="glass-panel p-3 p-md-4 w-100"
            style={{ maxWidth: 640 }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleNavSearchSubmit} className="position-relative mb-3">
              <Search
                size={20}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
              />
              <input
                type="text"
                autoFocus
                className="form-control form-control-cinema ps-5 pe-5 py-3 fs-6"
                placeholder="Search movies, IMAX experiences, actors..."
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
              />
              {navSearchQuery && (
                <button
                  type="button"
                  onClick={() => setNavSearchQuery('')}
                  className="btn btn-link text-secondary position-absolute top-50 end-0 translate-middle-y me-3 p-1"
                >
                  <X size={18} />
                </button>
              )}
            </form>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="text-secondary small fw-bold">Popular Searches:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchModalOpen(false);
                  navigate('/movies?q=Chronos');
                }}
                className="badge bg-white bg-opacity-10 text-light border-0 py-2 px-3 rounded-pill small"
              >
                Chronos: Beyond Reality
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchModalOpen(false);
                  navigate('/movies?q=Dune');
                }}
                className="badge bg-white bg-opacity-10 text-light border-0 py-2 px-3 rounded-pill small"
              >
                Dune: Part Two
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchModalOpen(false);
                  navigate('/movies?q=Gladiator');
                }}
                className="badge bg-white bg-opacity-10 text-light border-0 py-2 px-3 rounded-pill small"
              >
                Gladiator II
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

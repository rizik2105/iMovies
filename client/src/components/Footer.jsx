import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Globe, Heart, Shield, HelpCircle, Eye, Accessibility } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      className="mt-auto border-top border-white border-opacity-10 pt-5 pb-4"
      style={{ background: 'rgba(5, 7, 12, 0.98)' }}
    >
      <div className="container-fluid px-3 px-xl-5">
        <div className="row g-4 justify-content-between mb-5">
          {/* Brand & Mission Column */}
          <div className="col-lg-4 col-md-12">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #2563eb 0%, #0052cc 100%)',
                  boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)',
                }}
              >
                <Film size={18} color="#ffffff" />
              </div>
              <div className="d-flex flex-column leading-none">
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.35rem',
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
                  style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em' }}
                >
                  CINEMAS
                </span>
              </div>
            </div>

            <p className="text-secondary small mb-4" style={{ maxWidth: 380, lineHeight: 1.6 }}>
              Immerse yourself in world-class cinematic storytelling. Next-generation laser projection,
              precision spatial audio, and luxury recliner seating tailored for ultimate entertainment.
            </p>

            <div className="d-flex flex-wrap gap-2">
              <span className="format-pill blue">DUAL 4K LASER</span>
              <span className="format-pill dolby">DOLBY ATMOS 64CH</span>
              <span className="format-pill imax">ZERO-G VIP</span>
            </div>
          </div>

          {/* Column 1: Discovery */}
          <div className="col-lg-2 col-md-4 col-6">
            <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Discovery</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/movies?status=now_showing" className="text-secondary hover-blue text-decoration-none">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies?status=coming_soon" className="text-secondary hover-blue text-decoration-none">
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Sci-Fi" className="text-secondary hover-blue text-decoration-none">
                  IMAX 3D Laser
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-secondary hover-blue text-decoration-none">
                  Film Festivals
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-secondary hover-blue text-decoration-none">
                  Premiere Club
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Cinemas & More */}
          <div className="col-lg-2 col-md-4 col-6">
            <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Cinemas & More</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/movies" className="text-secondary hover-blue text-decoration-none">
                  Auditorium Finder
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-secondary hover-blue text-decoration-none">
                  Gourmet Dining
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-secondary hover-blue text-decoration-none">
                  Private Screenings
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-secondary hover-blue text-decoration-none">
                  Gift Vouchers
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-secondary hover-blue text-decoration-none">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Guest Support */}
          <div className="col-lg-3 col-md-4 col-12">
            <h6 className="text-white fw-bold mb-3 small text-uppercase tracking-wider">Guest Support</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2 mb-3">
              <li>
                <Link to="/movies" className="text-secondary hover-blue text-decoration-none">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-secondary hover-blue text-decoration-none">
                  Refund Policy (2-Hour Window)
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-secondary hover-blue text-decoration-none">
                  Feedback & Inquiries
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-cinema-outline p-2 rounded-circle"
                style={{ width: 34, height: 34 }}
                title="Global Audio Formats"
              >
                <Globe size={15} />
              </button>
              <button
                type="button"
                className="btn btn-cinema-outline p-2 rounded-circle"
                style={{ width: 34, height: 34 }}
                title="Audio Assistance"
              >
                <Accessibility size={15} />
              </button>
              <button
                type="button"
                className="btn btn-cinema-outline p-2 rounded-circle"
                style={{ width: 34, height: 34 }}
                title="Verified Projection Standards"
              >
                <Shield size={15} />
              </button>
            </div>
          </div>
        </div>

        <hr className="my-4 border-white border-opacity-10" />

        {/* Bottom Copyright & Legal Links */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-secondary small gap-2">
          <div>
            &copy; {new Date().getFullYear()} iMovies Entertainment Corporation. All rights reserved. Ultra-HD Master Projection Systems.
          </div>
          <div className="d-flex flex-wrap align-items-center gap-3">
            <Link to="/" className="text-secondary hover-white text-decoration-none">
              Privacy Policy
            </Link>
            <Link to="/" className="text-secondary hover-white text-decoration-none">
              Terms of Service
            </Link>
            <Link to="/" className="text-secondary hover-white text-decoration-none">
              Cookie Preferences
            </Link>
            <Link to="/" className="text-secondary hover-white text-decoration-none">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

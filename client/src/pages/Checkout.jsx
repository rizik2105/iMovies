import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { showApi } from '../api/showApi';
import Timer from '../components/Timer';
import {
  CreditCard,
  ShieldCheck,
  Film,
  Calendar,
  Clock,
  MapPin,
  Lock,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap,
  QrCode,
  Smartphone,
  Building,
} from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { showId, show, selectedSeats, lockExpiresAt, totalAmount } =
    location.state || {};

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    name: 'Alex Sterling',
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '888',
  });

  if (!showId || !selectedSeats || !show) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h5 className="text-white">No active checkout session found</h5>
        <p className="small mb-4">Please select a movie and lock your seats first.</p>
        <Link to="/movies" className="btn btn-cinema">
          Browse Movies
        </Link>
      </div>
    );
  }

  const movie = show.movieId;
  const screen = show.screenId;
  const theatre = screen?.theatreId;

  const handleTimerExpire = () => {
    alert('Your 5-minute seat hold has expired. The seats have been released.');
    navigate(`/shows/${showId}/seats`);
  };

  const handleCancelHold = async () => {
    try {
      await showApi.unlockSeats(showId, selectedSeats);
    } catch (e) {
      console.warn('Unlock failed or already expired');
    }
    navigate(`/shows/${showId}/seats`);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    try {
      setPaymentProcessing(true);
      setErrorMessage('');

      const res = await bookingApi.createBooking({
        showId,
        seats: selectedSeats,
      });

      if (res.success && res.data) {
        navigate(`/bookings/${res.data._id}`, {
          state: { booking: res.data, isNew: true },
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Payment processing failed. Please try again.';
      setErrorMessage(msg);
      setPaymentProcessing(false);
    }
  };

  const convenienceFee = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + convenienceFee;

  return (
    <div className="checkout-page py-4">
      <div className="container">
        {/* Navigation & Timer Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <button
            onClick={handleCancelHold}
            className="btn btn-cinema-outline btn-sm py-2 px-3 d-inline-flex align-items-center gap-2"
          >
            <ChevronLeft size={16} /> Release Seats & Change
          </button>

          {/* Countdown timer */}
          {lockExpiresAt && (
            <Timer expiresAt={lockExpiresAt} onExpire={handleTimerExpire} />
          )}
        </div>

        {errorMessage && (
          <div
            className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-4"
            role="alert"
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="row g-4">
          {/* Order Breakdown Column */}
          <div className="col-lg-7">
            <div className="glass-panel p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <Film size={20} color="var(--cinema-blue)" />
                  Booking Breakdown
                </h5>
                <span
                  className="badge px-3 py-1 rounded-pill small fw-semibold"
                  style={{
                    background: 'rgba(37, 99, 235, 0.2)',
                    color: '#60a5fa',
                    border: '1px solid rgba(37, 99, 235, 0.4)',
                  }}
                >
                  Hold Confirmed
                </span>
              </div>

              <div className="d-flex gap-3 mb-4 align-items-center">
                <img
                  src={movie?.posterUrl}
                  alt={movie?.title}
                  className="rounded-4 shadow"
                  style={{ width: 85, height: 120, objectFit: 'cover' }}
                />
                <div>
                  <h5 className="text-white fw-bold mb-1">{movie?.title}</h5>
                  <p className="text-secondary small mb-2">{movie?.genres?.join(', ')}</p>
                  <p className="text-light small mb-1 d-flex align-items-center gap-1">
                    <MapPin size={14} color="var(--cinema-blue)" />
                    {theatre?.name} &bull; {screen?.name}
                  </p>
                  <p className="text-secondary small mb-0 d-flex align-items-center gap-2">
                    <span>
                      <Calendar size={13} className="me-1" />
                      {new Date(show.startTime).toLocaleDateString()}
                    </span>
                    <span>
                      <Clock size={13} className="me-1" />
                      {new Date(show.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <hr className="border-white border-opacity-10 my-3" />

              {/* Seats and Fare Breakdown */}
              <div className="mb-3">
                <div className="d-flex justify-content-between text-secondary small mb-2">
                  <span>Reserved Seats ({selectedSeats.length})</span>
                  <div className="d-flex gap-1 flex-wrap">
                    {selectedSeats.map((s) => (
                      <span
                        key={s}
                        className="badge px-2 py-1 fw-bold"
                        style={{
                          background: 'rgba(37, 99, 235, 0.25)',
                          color: '#93c5fd',
                          borderRadius: 6,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-between text-light small mb-2">
                  <span className="text-secondary">Base Seat Price</span>
                  <span className="fw-semibold">₹{totalAmount}</span>
                </div>

                <div className="d-flex justify-content-between text-light small mb-2">
                  <span className="text-secondary">Convenience & GST (5%)</span>
                  <span className="fw-semibold">₹{convenienceFee}</span>
                </div>
              </div>

              <hr className="border-white border-opacity-10 my-3" />

              <div className="d-flex justify-content-between align-items-center">
                <span className="text-white fw-bold fs-5">Total Due</span>
                <span className="text-white fw-black fs-3" style={{ color: 'var(--cinema-cyan)' }}>
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            <div className="glass-panel p-3 d-flex align-items-center gap-3">
              <ShieldCheck size={28} color="#10b981" />
              <div className="small text-secondary">
                <strong className="text-white d-block">Instant Ticket Release Guarantee</strong>
                Your seats are exclusively allocated to your account ID until timer expiration.
              </div>
            </div>
          </div>

          {/* Payment Gateway Column */}
          <div className="col-lg-5">
            <div className="glass-panel p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
                  <CreditCard size={20} color="var(--cinema-blue)" />
                  Select Payment
                </h5>
                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 small px-2 py-1 rounded-pill">
                  Test Mode
                </span>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="d-flex gap-2 p-1 bg-black bg-opacity-40 rounded-pill border border-white border-opacity-10 mb-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`btn btn-sm w-50 rounded-pill small fw-semibold transition-all ${
                    paymentMethod === 'card' ? 'btn-cinema text-white shadow-sm' : 'text-secondary border-0 bg-transparent'
                  }`}
                >
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`btn btn-sm w-50 rounded-pill small fw-semibold transition-all ${
                    paymentMethod === 'upi' ? 'btn-cinema text-white shadow-sm' : 'text-secondary border-0 bg-transparent'
                  }`}
                >
                  UPI / QR
                </button>
              </div>

              {/* Virtual Card Preview */}
              <div
                className="p-3 rounded-4 mb-4 text-white position-relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #0c152e 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="small text-light opacity-75 tracking-widest text-uppercase" style={{ fontSize: '0.7rem' }}>
                    IMOVIES PLATINUM PASS
                  </span>
                  <Zap size={16} color="var(--cinema-cyan)" />
                </div>
                <div className="fs-5 font-monospace tracking-wider mb-3">
                  {cardData.number}
                </div>
                <div className="d-flex justify-content-between small text-light opacity-90">
                  <div>
                    <span className="d-block opacity-75" style={{ fontSize: '0.65rem' }}>
                      CARD HOLDER
                    </span>
                    <span className="fw-bold">{cardData.name}</span>
                  </div>
                  <div>
                    <span className="d-block opacity-75" style={{ fontSize: '0.65rem' }}>
                      EXPIRES
                    </span>
                    <span className="fw-bold">{cardData.expiry}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmPayment}>
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="btn btn-cinema w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-6"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                      <span>Minting QR E-Ticket...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Confirm & Pay ₹{grandTotal}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

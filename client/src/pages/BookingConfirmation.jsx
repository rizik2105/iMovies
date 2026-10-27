import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Printer,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Download,
  Share2,
  Tv,
} from 'lucide-react';

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#00f2fe', '#38bdf8', '#8b5cf6', '#ffffff'],
      });
    } catch (e) {
      // Ignore
    }

    if (!booking) {
      const fetchBooking = async () => {
        try {
          const res = await bookingApi.getBookingById(id);
          if (res.success) {
            setBooking(res.data);
          }
        } catch (err) {
          console.error('Failed to load booking details:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [id, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-secondary mt-2">Generating verified e-ticket pass...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container py-5 text-center text-secondary">
        <h5 className="text-white">Booking Not Found</h5>
        <Link to="/my-bookings" className="btn btn-cinema mt-3">
          View My Bookings
        </Link>
      </div>
    );
  }

  const show = booking.showId;
  const movie = show?.movieId;
  const screen = show?.screenId;
  const theatre = screen?.theatreId;

  const formattedDate = show?.startTime
    ? new Date(show.startTime).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const formattedTime = show?.startTime
    ? new Date(show.startTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div className="booking-confirmation-page py-4">
      <div className="container" style={{ maxWidth: 820 }}>
        {/* Success Alert Banner */}
        <div className="text-center mb-4 no-print">
          <div
            className="d-inline-flex p-3 rounded-circle mb-3 shadow"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 0 30px rgba(37, 99, 235, 0.5)',
            }}
          >
            <CheckCircle size={36} color="#ffffff" />
          </div>
          <h2 className="text-white fw-black mb-1">Reservation Confirmed!</h2>
          <p className="text-secondary small">
            Your e-ticket has been minted with an atomic contactless QR gate pass.
          </p>
        </div>

        {/* E-Ticket Boarding Pass */}
        <div className="ticket-card p-4 p-md-5 mb-4 position-relative">
          <div className="row g-4 align-items-center">
            {/* Left Movie Info */}
            <div className="col-md-8 border-end-md border-white border-opacity-10 pe-md-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span
                  className="badge text-uppercase fw-bold"
                  style={{
                    background: 'rgba(37, 99, 235, 0.25)',
                    color: '#60a5fa',
                    border: '1px solid rgba(37, 99, 235, 0.5)',
                    fontSize: '0.7rem',
                  }}
                >
                  E-Ticket Pass
                </span>
                <span className="text-secondary small font-monospace">
                  REF: {booking.reference || booking._id}
                </span>
              </div>

              <h3 className="text-white fw-bold mb-2">{movie?.title}</h3>
              <p className="text-secondary small mb-3">{movie?.genres?.join(', ')} &bull; {movie?.language}</p>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <span className="text-secondary small d-block">Theatre</span>
                  <span className="text-light fw-bold small d-flex align-items-center gap-1">
                    <MapPin size={13} color="var(--cinema-blue)" />
                    {theatre?.name}
                  </span>
                  <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                    {theatre?.city}
                  </span>
                </div>
                <div className="col-6">
                  <span className="text-secondary small d-block">Screen & Format</span>
                  <span className="text-light fw-bold small d-flex align-items-center gap-1">
                    <Tv size={13} color="var(--cinema-cyan)" />
                    {screen?.name}
                  </span>
                  <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                    Auditorium Laser 3D
                  </span>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <span className="text-secondary small d-block">Date & Showtime</span>
                  <span className="text-white fw-bold small d-flex align-items-center gap-1">
                    <Calendar size={13} /> {formattedDate}
                  </span>
                  <span className="text-info small d-flex align-items-center gap-1 mt-1">
                    <Clock size={13} /> {formattedTime}
                  </span>
                </div>
                <div className="col-6">
                  <span className="text-secondary small d-block">Allocated Seats</span>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {booking.seats?.map((seat) => (
                      <span
                        key={seat.seatId}
                        className="badge px-2 py-1 fw-bold"
                        style={{
                          background: 'rgba(37, 99, 235, 0.25)',
                          color: '#93c5fd',
                          border: '1px solid var(--cinema-blue)',
                          borderRadius: 6,
                          fontSize: '0.8rem',
                        }}
                      >
                        {seat.seatId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top border-white border-opacity-10">
                <span className="text-secondary small">Total Paid</span>
                <span className="text-white fw-bold fs-5" style={{ color: 'var(--cinema-cyan)' }}>
                  ₹{booking.totalAmount}
                </span>
              </div>
            </div>

            {/* Right QR Gate Pass */}
            <div className="col-md-4 text-center">
              <div
                className="bg-white p-3 rounded-4 d-inline-block shadow mb-2"
                style={{ width: 'fit-content' }}
              >
                <QRCodeSVG
                  value={`IMOVIES:${booking.reference || booking._id}:${booking.seats?.map(s => s.seatId).join(',')}`}
                  size={140}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-secondary small text-uppercase tracking-wider fw-bold mt-1" style={{ fontSize: '0.7rem' }}>
                Contactless Gate QR
              </div>
              <span className="badge bg-success bg-opacity-25 text-success small mt-1">
                Verified & Valid
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="d-flex flex-wrap justify-content-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="btn btn-cinema-outline d-inline-flex align-items-center gap-2 py-2 px-4"
          >
            <Printer size={16} />
            <span>Print / Save Ticket (PDF)</span>
          </button>
          <Link
            to="/my-bookings"
            className="btn btn-cinema d-inline-flex align-items-center gap-2 py-2 px-4"
          >
            <Ticket size={16} />
            <span>View All My Bookings</span>
          </Link>
          <Link
            to="/"
            className="btn btn-cinema-outline d-inline-flex align-items-center gap-2 py-2 px-4"
          >
            <span>Back to Home</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

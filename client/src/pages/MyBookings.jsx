import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import { QRCodeSVG } from 'qrcode.react';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Tv,
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [activeQrModal, setActiveQrModal] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getMyBookings();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const now = new Date();

  // Filter bookings into Upcoming vs Past/Cancelled
  const upcomingBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    const startTime = new Date(b.showId?.startTime);
    return startTime > now;
  });

  const pastBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return true;
    const startTime = new Date(b.showId?.startTime);
    return startTime <= now;
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  // Handle cancellation
  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this booking? This will immediately release your reserved seats.'
      )
    ) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setActionError('');
      setActionSuccess('');

      const res = await bookingApi.cancelBooking(bookingId);
      if (res.success) {
        setActionSuccess('Booking cancelled successfully and seats have been released.');
        fetchBookings();
      }
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          'Failed to cancel booking. Notice: Bookings can only be cancelled up to 2 hours before showtime.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Check if booking is cancelable (>= 2 hours before showtime)
  const isCancelable = (booking) => {
    if (booking.status === 'cancelled') return false;
    if (!booking.showId?.startTime) return false;
    const showTime = new Date(booking.showId.startTime).getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    return showTime - Date.now() >= twoHoursInMs;
  };

  return (
    <div className="my-bookings-page py-4">
      <div className="container">
        {/* Header and Filter Tabs */}
        <div className="glass-panel p-4 mb-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 text-primary small fw-bold text-uppercase mb-1">
                <Ticket size={15} color="var(--cinema-blue)" /> Customer Wallet
              </div>
              <h2 className="text-white fw-bold m-0 fs-3">My Cinema Bookings</h2>
            </div>

            {/* Filter Toggle Pills */}
            <div className="d-inline-flex p-1 bg-black bg-opacity-40 rounded-pill border border-white border-opacity-10 align-self-start align-self-sm-auto">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`btn btn-sm rounded-pill px-3 py-1 transition-all ${
                  activeTab === 'upcoming' ? 'btn-cinema shadow-sm' : 'text-secondary border-0 bg-transparent'
                }`}
              >
                Active / Upcoming ({upcomingBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`btn btn-sm rounded-pill px-3 py-1 transition-all ${
                  activeTab === 'past' ? 'btn-cinema shadow-sm' : 'text-secondary border-0 bg-transparent'
                }`}
              >
                Past & Cancelled ({pastBookings.length})
              </button>
            </div>
          </div>
        </div>

        {/* Action Notifications */}
        {actionSuccess && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-4" role="alert">
            <CheckCircle size={18} />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-4" role="alert">
            <AlertTriangle size={18} />
            <span>{actionError}</span>
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-secondary mt-3">Loading booking ledger...</p>
          </div>
        ) : displayedBookings.length === 0 ? (
          <div className="glass-panel p-5 text-center text-secondary">
            <Ticket size={48} className="mb-3 text-secondary opacity-50" />
            <h5 className="text-white">No {activeTab} bookings found</h5>
            <p className="small mb-4">
              {activeTab === 'upcoming'
                ? "You haven't reserved any upcoming movies yet."
                : 'No historical or cancelled reservations recorded.'}
            </p>
            <Link to="/movies" className="btn btn-cinema">
              Discover Movies
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {displayedBookings.map((booking) => {
              const show = booking.showId;
              const movie = show?.movieId;
              const screen = show?.screenId;
              const theatre = screen?.theatreId;

              const isCancelled = booking.status === 'cancelled';
              const cancelable = isCancelable(booking);

              const formattedDate = show?.startTime
                ? new Date(show.startTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : '';
              const formattedTime = show?.startTime
                ? new Date(show.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';

              return (
                <div key={booking._id} className="glass-panel p-4">
                  <div className="row g-3 align-items-center">
                    {/* Movie Poster */}
                    <div className="col-auto">
                      <img
                        src={movie?.posterUrl}
                        alt={movie?.title}
                        className="rounded-3 shadow"
                        style={{ width: 70, height: 98, objectFit: 'cover' }}
                      />
                    </div>

                    {/* Movie and Show Details */}
                    <div className="col">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        <span
                          className={`badge ${
                            isCancelled
                              ? 'bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25'
                              : 'bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25'
                          } small text-uppercase`}
                        >
                          {booking.status}
                        </span>
                        <span className="text-secondary small font-monospace">
                          REF: {booking.reference || booking._id}
                        </span>
                      </div>

                      <h5 className="text-white fw-bold mb-1">{movie?.title}</h5>
                      <p className="text-light small mb-1 d-flex align-items-center gap-1">
                        <MapPin size={13} color="var(--cinema-blue)" />
                        {theatre?.name} &bull; {screen?.name}
                      </p>

                      <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small">
                        <span className="d-flex align-items-center gap-1 text-light">
                          <Calendar size={13} /> {formattedDate}
                        </span>
                        <span className="d-flex align-items-center gap-1 text-info">
                          <Clock size={13} /> {formattedTime}
                        </span>
                        <span>
                          Seats:{' '}
                          <span className="text-info fw-bold">
                            {booking.seats?.map((s) => s.seatId).join(', ')}
                          </span>
                        </span>
                        <span>
                          Paid: <strong className="text-white">₹{booking.totalAmount}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-12 col-md-auto d-flex flex-wrap align-items-center gap-2 mt-3 mt-md-0">
                      <button
                        onClick={() => setActiveQrModal(booking)}
                        className="btn btn-cinema-outline btn-sm d-flex align-items-center gap-1"
                        title="Show Pass QR"
                      >
                        <Eye size={14} />
                        <span>View Pass</span>
                      </button>

                      <Link
                        to={`/bookings/${booking._id}`}
                        className="btn btn-cinema btn-sm d-flex align-items-center gap-1"
                      >
                        <Ticket size={14} />
                        <span>Print Ticket</span>
                      </Link>

                      {cancelable && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="btn btn-outline-danger btn-sm rounded-pill"
                        >
                          {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* QR Code Quick View Modal */}
        {activeQrModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1060 }}
            onClick={() => setActiveQrModal(null)}
          >
            <div
              className="glass-panel p-4 text-center"
              style={{ maxWidth: 360, width: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h5 className="text-white fw-bold mb-1">
                {activeQrModal.showId?.movieId?.title}
              </h5>
              <p className="text-secondary small mb-3">
                Scan at theater entrance turnstile
              </p>
              <div className="bg-white p-3 rounded-4 d-inline-block shadow mb-3">
                <QRCodeSVG
                  value={`IMOVIES:${activeQrModal.reference || activeQrModal._id}`}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-white small fw-bold mb-2">
                Seats: {activeQrModal.seats?.map((s) => s.seatId).join(', ')}
              </p>
              <button
                onClick={() => setActiveQrModal(null)}
                className="btn btn-cinema-outline w-100 py-1"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

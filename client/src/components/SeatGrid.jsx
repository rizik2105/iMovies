import React from 'react';
import { Sparkles, Armchair, Eye, Star, Ticket } from 'lucide-react';

const SeatGrid = ({
  seats = [],
  prices = { regular: 150, premium: 250, recliner: 400 },
  selectedSeats = [],
  onSeatToggle,
  currentUserId,
}) => {
  // Group seats by row letter (e.g. 'A', 'B', 'C')
  const groupedRows = seats.reduce((acc, seat) => {
    const rowLetter = seat.seatId.match(/[A-Z]+/)?.[0] || 'A';
    if (!acc[rowLetter]) {
      acc[rowLetter] = {
        label: rowLetter,
        category: seat.category,
        seats: [],
      };
    }
    acc[rowLetter].seats.push(seat);
    return acc;
  }, {});

  const rows = Object.values(groupedRows);

  const getSeatStatus = (seat) => {
    if (selectedSeats.includes(seat.seatId)) {
      return 'selected';
    }
    if (seat.status === 'booked') {
      return 'booked';
    }
    if (seat.status === 'locked') {
      return 'locked';
    }
    return 'available';
  };

  const handleSeatClick = (seat) => {
    const status = getSeatStatus(seat);
    if (status === 'booked' || status === 'locked') {
      return;
    }
    onSeatToggle(seat);
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'recliner':
        return <Armchair size={13} color="var(--cinema-gold)" />;
      case 'premium':
        return <Star size={13} color="var(--cinema-cyan)" />;
      default:
        return <Ticket size={13} className="text-secondary" />;
    }
  };

  return (
    <div className="seat-grid-container text-center py-2">
      {/* 3D Curved Cinema Projection Screen */}
      <div className="cinema-screen-container">
        <div className="cinema-screen"></div>
        <div className="cinema-screen-glow"></div>
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-black bg-opacity-50 border border-white border-opacity-10 text-secondary small fw-semibold tracking-wider text-uppercase mt-2 mb-4">
          <Eye size={13} color="var(--cinema-cyan)" />
          <span>All Eyes This Way &bull; Curved Laser Projection</span>
        </div>
      </div>

      {/* Seat Rows by Category with horizontal scroll safety for laptops */}
      <div className="seat-grid-scroll-wrap">
        <div className="d-flex flex-column gap-3 align-items-center mb-4">
          {rows.map((row) => (
            <div key={row.label} className="w-100 d-flex flex-column align-items-center">
              {/* Category label for row transition */}
              <div className="d-flex align-items-center gap-2 mb-1">
                <span
                  className="badge d-inline-flex align-items-center gap-1 text-capitalize px-3 py-1 rounded-pill fw-semibold"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.72rem',
                  }}
                >
                  {getCategoryIcon(row.category)}
                  <span>
                    {row.category} &bull; ₹{prices[row.category] || 150}
                  </span>
                </span>
              </div>

              {/* Seats in Row (flex-nowrap prevents line-breaks on small/laptop viewports) */}
              <div className="seat-row-track">
                {/* Row Letter Left */}
                <div
                  className="text-secondary fw-bold me-2 user-select-none"
                  style={{ width: 22, fontSize: '0.85rem' }}
                >
                  {row.label}
                </div>

                {row.seats.map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <div
                      key={seat.seatId}
                      className={`seat-box ${status}`}
                      onClick={() => handleSeatClick(seat)}
                      title={`Seat ${seat.seatId} (${seat.category}) - ₹${
                        prices[seat.category] || 150
                      } • Click to ${status === 'selected' ? 'deselect' : 'select'}`}
                    >
                      {seat.seatId.replace(/^[A-Z]+/, '')}
                    </div>
                  );
                })}

                {/* Row Letter Right */}
                <div
                  className="text-secondary fw-bold ms-2 user-select-none"
                  style={{ width: 22, fontSize: '0.85rem' }}
                >
                  {row.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Status Legend Pill */}
      <div
        className="p-2 px-4 d-inline-flex flex-wrap justify-content-center gap-3 gap-md-4 align-items-center mx-auto rounded-pill border border-white border-opacity-10 shadow-sm"
        style={{ background: 'rgba(9, 13, 22, 0.65)', backdropFilter: 'blur(12px)' }}
      >
        <div className="seat-legend-item">
          <div
            className="seat-box available"
            style={{ width: 18, height: 18, fontSize: '0.65rem' }}
          ></div>
          <span>Available</span>
        </div>
        <div className="seat-legend-item">
          <div
            className="seat-box selected"
            style={{ width: 18, height: 18, fontSize: '0.65rem' }}
          ></div>
          <span>Selected</span>
        </div>
        <div className="seat-legend-item">
          <div
            className="seat-box locked"
            style={{ width: 18, height: 18, fontSize: '0.65rem' }}
          ></div>
          <span>Held (5m Lock)</span>
        </div>
        <div className="seat-legend-item">
          <div
            className="seat-box booked"
            style={{ width: 18, height: 18, fontSize: '0.65rem' }}
          ></div>
          <span>Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;

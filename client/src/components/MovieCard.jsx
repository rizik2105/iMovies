import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Globe, Ticket, ArrowUpRight, Film, Sparkles } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const isComingSoon = movie.status === 'coming_soon';

  const hasImax = movie.genres?.includes('Sci-Fi') || movie.title.includes('IMAX') || movie.description?.toLowerCase().includes('imax');
  const hasDolby = movie.genres?.includes('Action') || movie.genres?.includes('Adventure') || movie.genres?.includes('Thriller');

  // Subtitle genre + duration formatting
  const mainGenre = movie.genres?.[0]?.toUpperCase() || 'CINEMA';
  const subGenre = movie.genres?.[1]?.toUpperCase() || 'PREMIERE';
  const durationHours = Math.floor((movie.durationMin || 120) / 60);
  const durationRemainder = (movie.durationMin || 120) % 60;
  const formattedDuration = `${durationHours}h ${durationRemainder}m`;

  return (
    <div className="movie-card-modern h-100">
      {/* Poster with Floating Badges */}
      <Link to={`/movies/${movie._id}`} className="movie-poster-wrap text-decoration-none d-block">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';
          }}
        />
        <div className="movie-poster-gradient" />

        {/* Floating Top Badges */}
        <div className="movie-floating-badges">
          {isComingSoon ? (
            <div
              className="badge text-white fw-bold px-2 py-1"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: 9999,
                fontSize: '0.68rem',
                boxShadow: '0 2px 10px rgba(37, 99, 235, 0.5)',
              }}
            >
              COMING SOON
            </div>
          ) : (
            <div
              className="movie-badge-glass text-light"
              style={{ fontSize: '0.7rem', padding: '3px 9px' }}
            >
              <span className="pulse-indicator" style={{ width: 6, height: 6 }}></span>
              <span>NOW PLAYING</span>
            </div>
          )}

          {movie.rating > 0 && (
            <div className="movie-badge-glass text-warning" style={{ fontSize: '0.72rem' }}>
              <Star size={12} fill="var(--cinema-gold)" color="var(--cinema-gold)" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          {/* Subtitle Spec: e.g. SCI-FI / EPIC • 2h 46m */}
          <div
            className="text-secondary small fw-bold text-uppercase mb-1 tracking-wider"
            style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}
          >
            {mainGenre} / {subGenre} &bull; {formattedDuration}
          </div>

          {/* Title */}
          <Link to={`/movies/${movie._id}`} className="text-decoration-none">
            <h5
              className="text-white mb-2 text-truncate"
              title={movie.title}
              style={{ fontSize: '1.05rem', fontWeight: 800 }}
            >
              {movie.title}
            </h5>
          </Link>

          {/* Experience Tags matching Stitch mockup */}
          <div className="d-flex flex-wrap gap-1 mb-3">
            {hasImax ? (
              <span className="format-pill imax">IMAX 3D Laser</span>
            ) : hasDolby ? (
              <span className="format-pill dolby">Dolby Atmos</span>
            ) : (
              <span className="format-pill blue">4K Laser</span>
            )}
            <span
              className="badge bg-white bg-opacity-10 text-light fw-normal"
              style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: 6 }}
            >
              Recliner VIP
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-2 border-top border-white border-opacity-10 d-flex align-items-center justify-content-between gap-2">
          <Link
            to={`/movies/${movie._id}`}
            className="text-secondary small text-decoration-none hover-white"
            style={{ fontSize: '0.8rem' }}
          >
            Details
          </Link>

          <Link
            to={`/movies/${movie._id}`}
            className={`btn btn-sm ${
              isComingSoon ? 'btn-cinema-outline' : 'btn-cinema'
            } px-3 py-1 d-flex align-items-center gap-1`}
            style={{ fontSize: '0.82rem' }}
          >
            {isComingSoon ? (
              <span>Notify Me</span>
            ) : (
              <>
                <Ticket size={13} />
                <span>Book Seats</span>
                <ArrowUpRight size={13} />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

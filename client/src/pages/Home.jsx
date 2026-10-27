import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { movieApi } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import {
  Search,
  Sparkles,
  Flame,
  Play,
  ArrowRight,
  ShieldCheck,
  Ticket,
  Clock,
  Star,
  Compass,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Tv,
  Volume2,
  Bookmark,
  Share2,
  Moon,
  Info,
  CheckCircle,
} from 'lucide-react';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Fast Seat Picker state
  const [selectedFastSeats, setSelectedFastSeats] = useState(['B5', 'B6']);
  const [selectedShowtime, setSelectedShowtime] = useState('14:30');
  const navigate = useNavigate();

  // Floating filter form state
  const [filterCinema, setFilterCinema] = useState('Lincoln Square NY');
  const [filterDate, setFilterDate] = useState('Today, Oct 28');
  const [filterFormat, setFilterFormat] = useState('All Formats');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await movieApi.getMovies({ limit: 12 });
        if (res.success && res.data) {
          setMovies(res.data);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Spotlight movie (Chronos: Beyond Reality or first movie)
  const spotlightMovie =
    movies.find((m) => m.title.toLowerCase().includes('chronos')) ||
    movies[0] || {
      _id: 'chronos',
      title: 'Chronos: Beyond Reality',
      description:
        'When the fabric of fractured timelines collides, two rogue operatives must confront an all-consuming cosmic rift before the final sanctuary of mankind is torn apart forever.',
      rating: 9.4,
      durationMin: 138,
      language: 'English | Dolby 7.1 + Spanish + French',
      genres: ['Sci-Fi', 'Action'],
      posterUrl:
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    };

  // Filter movies for "Trending Blockbusters"
  const filterTabs = ['All Releases', 'IMAX Only', 'Dolby Atmos', 'VIP Lounge'];
  const filteredBlockbusters = movies.filter((m) => {
    if (activeTab === 'IMAX Only') return m.genres?.includes('Sci-Fi') || m.title.includes('IMAX');
    if (activeTab === 'Dolby Atmos') return m.genres?.includes('Action') || m.genres?.includes('Thriller');
    if (activeTab === 'VIP Lounge') return m.rating >= 8.5;
    return true;
  });

  // Toggle fast seat selection
  const toggleFastSeat = (seatId) => {
    if (selectedFastSeats.includes(seatId)) {
      setSelectedFastSeats(selectedFastSeats.filter((s) => s !== seatId));
    } else {
      if (selectedFastSeats.length >= 6) return;
      setSelectedFastSeats([...selectedFastSeats, seatId]);
    }
  };

  const fastSeatPrice = 21.0;
  const fastSeatSubtotal = (selectedFastSeats.length * fastSeatPrice).toFixed(2);

  const handleFindShowtimes = (e) => {
    e.preventDefault();
    navigate(`/movies?cinema=${encodeURIComponent(filterCinema)}&format=${encodeURIComponent(filterFormat)}`);
  };

  return (
    <div className="home-page pb-5">
      {/* 1. CINEMATIC HERO SPOTLIGHT */}
      <section className="position-relative overflow-hidden mb-4">
        <div
          className="position-relative d-flex align-items-center"
          style={{
            minHeight: '82vh',
            backgroundImage: `linear-gradient(to right, #07090e 30%, rgba(7, 9, 14, 0.82) 65%, rgba(7, 9, 14, 0.45) 100%), radial-gradient(circle at 75% 30%, rgba(37, 99, 235, 0.25) 0%, transparent 60%), url(${spotlightMovie.posterUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
          }}
        >
          <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
            <div className="row align-items-center">
              <div className="col-lg-8 col-xl-7">
                {/* Spotlight Pills Row */}
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                  <span
                    className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill small fw-bold"
                    style={{
                      background: 'rgba(37, 99, 235, 0.2)',
                      border: '1px solid rgba(37, 99, 235, 0.5)',
                      color: '#60a5fa',
                      fontSize: '0.75rem',
                    }}
                  >
                    <span className="pulse-indicator"></span> SPOTLIGHT PREMIERE
                  </span>

                  <span
                    className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill small fw-bold text-info"
                    style={{
                      background: 'rgba(0, 242, 254, 0.12)',
                      border: '1px solid rgba(0, 242, 254, 0.3)',
                      fontSize: '0.75rem',
                    }}
                  >
                    <Sparkles size={12} /> DOLBY ATMOS + IMAX 3D WITH LASER
                  </span>

                  <span
                    className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill small fw-bold text-warning"
                    style={{
                      background: 'rgba(255, 184, 0, 0.12)',
                      border: '1px solid rgba(255, 184, 0, 0.3)',
                      fontSize: '0.75rem',
                    }}
                  >
                    <Star size={12} fill="var(--cinema-gold)" /> IMDb {spotlightMovie.rating}
                  </span>

                  <span
                    className="badge bg-white bg-opacity-10 text-light fw-semibold px-3 py-1 rounded-pill"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Rotten Tomatoes 96%
                  </span>
                </div>

                {/* Subtitle tag */}
                <div
                  className="text-uppercase tracking-widest text-light opacity-75 small fw-bold mb-1"
                  style={{ letterSpacing: '0.15em', fontSize: '0.8rem' }}
                >
                  EXCLUSIVE THEATRICAL ENGAGEMENT
                </div>

                {/* Huge Title with Blue Accent */}
                <h1
                  className="display-3 fw-black text-white mb-3"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, lineHeight: 1.1 }}
                >
                  CHRONOS:{' '}
                  <span
                    style={{
                      color: 'var(--cinema-blue)',
                      textShadow: '0 0 40px rgba(37, 99, 235, 0.65)',
                    }}
                  >
                    BEYOND REALITY
                  </span>
                </h1>

                {/* Synopsis */}
                <p
                  className="lead text-secondary mb-4"
                  style={{ fontSize: '1.05rem', maxWidth: 640, lineHeight: 1.6 }}
                >
                  {spotlightMovie.description}
                </p>

                {/* Meta specifications line */}
                <div className="d-flex flex-wrap align-items-center gap-2 mb-4 text-secondary small">
                  <span className="d-inline-flex align-items-center gap-1 text-light">
                    <Clock size={13} className="text-primary" /> {spotlightMovie.durationMin || 138}m
                  </span>
                  <span>&bull;</span>
                  <span className="text-light">PG-13 • Sci-Fi / Action</span>
                  <span>&bull;</span>
                  <span className="text-secondary">{spotlightMovie.language}</span>
                  <span>&bull;</span>
                  <span className="badge bg-white bg-opacity-10 text-secondary">
                    CC & Subtitles available
                  </span>
                </div>

                {/* Action CTA Buttons */}
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <Link
                    to={`/movies/${spotlightMovie._id}`}
                    className="btn btn-cinema btn-lg px-4 py-2"
                  >
                    <Ticket size={18} />
                    <span>Book Seats Now</span>
                  </Link>

                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="btn btn-cinema-outline btn-lg px-4 py-2 d-inline-flex align-items-center gap-2"
                  >
                    <Play size={16} fill="#ffffff" />
                    <span>Watch 4K Trailer</span>
                  </button>

                  <button
                    onClick={() => alert('Added to Watchlist!')}
                    className="btn btn-cinema-outline btn-lg px-3 py-2 d-inline-flex align-items-center gap-2"
                    title="Add to Watchlist"
                  >
                    <Bookmark size={16} />
                    <span>Watchlist</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING SCHEDULE & FILTER BAR (DIRECTLY BELOW HERO) */}
      <div className="container mb-5">
        <div
          className="glass-panel p-3 p-md-4 rounded-4 shadow-lg position-relative"
          style={{ marginTop: '-45px', zIndex: 10 }}
        >
          <form onSubmit={handleFindShowtimes}>
            <div className="row g-3 align-items-center">
              {/* Cinema Selector */}
              <div className="col-lg-3 col-md-6">
                <label className="text-secondary small fw-bold text-uppercase d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.68rem' }}>
                  <MapPin size={12} color="var(--cinema-blue)" /> Cinema & Complex
                </label>
                <select
                  className="form-select form-select-cinema"
                  value={filterCinema}
                  onChange={(e) => setFilterCinema(e.target.value)}
                >
                  <option value="Lincoln Square NY">iMovies IMAX + Lincoln Square NY</option>
                  <option value="Mumbai Grand">PVR ICON Grand Galleria</option>
                  <option value="Bengaluru Nexus">INOX Megaplex Nexus</option>
                  <option value="Delhi Forum">Cinépolis VIP Forum</option>
                </select>
              </div>

              {/* Date Selector */}
              <div className="col-lg-3 col-md-6">
                <label className="text-secondary small fw-bold text-uppercase d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.68rem' }}>
                  <Calendar size={12} color="var(--cinema-cyan)" /> Date
                </label>
                <select
                  className="form-select form-select-cinema"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                >
                  <option value="Today, Oct 28">Today, Oct 28 (Premieres)</option>
                  <option value="Tomorrow, Oct 29">Tomorrow, Oct 29</option>
                  <option value="Thu, Oct 30">Thursday, Oct 30</option>
                  <option value="Fri, Oct 31">Friday, Oct 31 (Halloween Special)</option>
                </select>
              </div>

              {/* Experience / Format Selector */}
              <div className="col-lg-3 col-md-6">
                <label className="text-secondary small fw-bold text-uppercase d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.68rem' }}>
                  <Layers size={12} color="var(--cinema-gold)" /> Experience / Format
                </label>
                <select
                  className="form-select form-select-cinema"
                  value={filterFormat}
                  onChange={(e) => setFilterFormat(e.target.value)}
                >
                  <option value="All Formats">All Formats (IMAX, 4DX, VIP)</option>
                  <option value="IMAX 3D Laser">IMAX 3D Dual 4K Laser</option>
                  <option value="Dolby Atmos">Dolby Atmos & Vision</option>
                  <option value="VIP Recliners">Heated Zero-G Recliners</option>
                </select>
              </div>

              {/* Find Showtimes CTA */}
              <div className="col-lg-3 col-md-6 d-flex align-items-end">
                <button
                  type="submit"
                  className="btn btn-cinema w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ height: 48 }}
                >
                  <Search size={16} />
                  <span>Find Showtimes</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* 3. TRENDING BLOCKBUSTERS */}
      <section className="container mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 text-primary fw-bold small text-uppercase mb-1">
              <span className="pulse-indicator"></span> NOW SHOWING
            </div>
            <h2 className="text-white fw-bold m-0 fs-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Trending Blockbusters
            </h2>
          </div>

          {/* Filter Pill Tabs */}
          <div className="d-inline-flex p-1 bg-black bg-opacity-40 rounded-pill border border-white border-opacity-10 overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`btn btn-sm rounded-pill px-3 py-1 fw-bold text-nowrap transition-all ${
                  activeTab === tab ? 'btn-cinema shadow-sm' : 'text-secondary border-0 bg-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Movie Cards Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-secondary mt-3">Loading cinema blockbusters...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredBlockbusters.slice(0, 4).map((movie) => (
              <div key={movie._id} className="col">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. TECHNOLOGICAL PINNACLE - ENGINEERED FOR THE SENSES */}
      <section className="container mb-5">
        <div className="mb-4">
          <div
            className="text-uppercase tracking-widest small fw-bold mb-1"
            style={{ color: 'var(--cinema-cyan)', fontSize: '0.75rem', letterSpacing: '0.12em' }}
          >
            TECHNOLOGICAL PINNACLE
          </div>
          <h2 className="text-white fw-black m-0 fs-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Engineered for The Senses
          </h2>
        </div>

        <div className="row g-4">
          {/* Card 1: IMAX with Dual 4K Laser */}
          <div className="col-md-6">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <span
                  className="badge px-3 py-1 rounded-pill fw-bold text-uppercase mb-3"
                  style={{
                    background: 'rgba(0, 242, 254, 0.12)',
                    color: 'var(--cinema-cyan)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    fontSize: '0.7rem',
                  }}
                >
                  MULTI-SPECTRUM LASER PROJECTION
                </span>
                <h4 className="text-white fw-bold mb-2">IMAX with Dual 4K Laser</h4>
                <p className="text-secondary small mb-4" style={{ lineHeight: 1.6 }}>
                  Custom-designed optical engine delivering unprecedented brightness, razor-sharp imagery,
                  deeper contrast, and a color spectrum that covers Rec. 2020.
                </p>
              </div>

              <div className="row g-2 text-center pt-3 border-top border-white border-opacity-10">
                <div className="col-4">
                  <div className="text-white fw-black fs-5" style={{ color: 'var(--cinema-cyan)' }}>
                    1.43:1
                  </div>
                  <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
                    Full Aspect Ratio
                  </div>
                </div>
                <div className="col-4 border-start border-end border-white border-opacity-10">
                  <div className="text-white fw-black fs-5">12-Ch</div>
                  <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
                    Immersive Audio
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-white fw-black fs-5" style={{ color: 'var(--cinema-gold)' }}>
                    300%
                  </div>
                  <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
                    Higher Contrast
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Dolby Atmos & Vision with Audio Visualizer */}
          <div className="col-md-6">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <span
                  className="badge px-3 py-1 rounded-pill fw-bold text-uppercase mb-3"
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#c084fc',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    fontSize: '0.7rem',
                  }}
                >
                  SPATIAL SOUND
                </span>
                <h4 className="text-white fw-bold mb-2">Dolby Atmos & Vision</h4>
                <p className="text-secondary small mb-4" style={{ lineHeight: 1.6 }}>
                  64 individual sound channels placing audio cues in precise 3D physical coordinates above
                  and around your zero-gravity recliner.
                </p>
              </div>

              {/* Animated Audio Equalizer Visualizer */}
              <div className="d-flex align-items-center justify-content-between pt-3 border-top border-white border-opacity-10">
                <div className="d-flex align-items-end gap-1" style={{ height: 36 }}>
                  {[16, 28, 12, 34, 22, 10, 32, 26, 18, 30, 14, 24].map((h, i) => (
                    <div
                      key={i}
                      className="equalizer-bar"
                      style={{
                        height: h,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${0.8 + (i % 4) * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-secondary small fw-bold tracking-widest text-uppercase" style={{ fontSize: '0.72rem' }}>
                  DOLBY MASTER AUDIO
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Heated Zero-G Recliners */}
          <div className="col-md-6">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <span
                  className="badge px-3 py-1 rounded-pill fw-bold text-uppercase mb-3"
                  style={{
                    background: 'rgba(255, 184, 0, 0.12)',
                    color: 'var(--cinema-gold)',
                    border: '1px solid rgba(255, 184, 0, 0.3)',
                    fontSize: '0.7rem',
                  }}
                >
                  PREMIERE COMFORT
                </span>
                <h4 className="text-white fw-bold mb-2">Heated Zero-G Recliners</h4>
                <p className="text-secondary small mb-4" style={{ lineHeight: 1.6 }}>
                  Hand-crafted Italian leather loungers with wireless charging, integrated heated cushions,
                  and whisper-quiet in-seat gourmet dining delivery.
                </p>
              </div>

              <div className="d-flex gap-3 pt-3 border-top border-white border-opacity-10">
                <span className="badge bg-white bg-opacity-10 text-light py-2 px-3 rounded-pill small">
                  170° Flat-Lay
                </span>
                <span className="badge bg-white bg-opacity-10 text-light py-2 px-3 rounded-pill small">
                  Chef-Curated Menus
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Midnight & Exclusives */}
          <div className="col-md-6">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span
                    className="badge px-3 py-1 rounded-pill fw-bold text-uppercase"
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      color: '#c084fc',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      fontSize: '0.7rem',
                    }}
                  >
                    MIDNIGHT & EXCLUSIVES
                  </span>
                  <Moon size={18} color="var(--cinema-purple)" />
                </div>
                <h4 className="text-white fw-bold mb-2">Halloween Midnight Madness</h4>
                <p className="text-secondary small mb-4" style={{ lineHeight: 1.6 }}>
                  Special 35mm film screenings, themed cocktails, and exclusive collectible laser posters
                  for all attendees.
                </p>
              </div>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top border-white border-opacity-10">
                <span className="text-secondary small">Thu, Oct 31 &bull; 11:45 PM EDT</span>
                <Link to="/movies" className="btn btn-cinema btn-sm py-2 px-3">
                  Reserve Midnight Pass
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TODAY'S SHOWTIMES & FAST SEAT PICKER (MATCHING STITCH MOCKUP) */}
      <section className="container mb-5">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
          <div>
            <div
              className="text-uppercase tracking-widest small fw-bold mb-1"
              style={{ color: 'var(--cinema-blue)', fontSize: '0.75rem', letterSpacing: '0.12em' }}
            >
              REAL-TIME AVAILABILITY
            </div>
            <h2 className="text-white fw-bold m-0 fs-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Today's Showtimes & Seat Picker
            </h2>
          </div>
          <div className="d-flex align-items-center gap-1 text-secondary small bg-black bg-opacity-40 p-2 px-3 rounded-pill border border-white border-opacity-10">
            <MapPin size={13} color="var(--cinema-blue)" />
            <span>Lincoln Square IMAX & Dining</span>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Column: Showtimes List */}
          <div className="col-lg-6">
            <div className="d-flex flex-column gap-3">
              {/* Movie 1: Chronos */}
              <div className="glass-panel p-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h4 className="text-white fw-bold m-0 fs-5">{spotlightMovie.title}</h4>
                  <span
                    className="badge text-uppercase fw-bold"
                    style={{
                      background: 'rgba(37, 99, 235, 0.18)',
                      color: '#60a5fa',
                      fontSize: '0.65rem',
                      borderRadius: 9999,
                    }}
                  >
                    AUDITORIUM 1
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="text-secondary small">7500 sq ft Laser &bull; 17-Channel Spatial Sound</span>
                  <span className="badge bg-danger bg-opacity-25 text-danger small" style={{ fontSize: '0.65rem' }}>
                    FILLING FAST (82%)
                  </span>
                </div>

                {/* Showtimes Pills */}
                <div className="d-flex flex-wrap gap-2">
                  {[
                    { time: '14:30', tag: 'IMAX 3D' },
                    { time: '17:45', tag: 'IMAX 3D' },
                    { time: '21:00', tag: 'Laser 3D' },
                    { time: '23:45', tag: 'Late Night' },
                  ].map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      onClick={() => setSelectedShowtime(s.time)}
                      className={`btn d-flex flex-column align-items-center py-2 px-3 rounded-3 transition-all ${
                        selectedShowtime === s.time
                          ? 'btn-cinema text-white shadow'
                          : 'btn-cinema-outline text-light'
                      }`}
                      style={{ minWidth: 95 }}
                    >
                      <span className="fw-bold" style={{ fontSize: '0.95rem' }}>
                        {s.time}
                      </span>
                      <span className="small opacity-75" style={{ fontSize: '0.7rem' }}>
                        {s.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Movie 2: Dune Part Two */}
              <div className="glass-panel p-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h4 className="text-white fw-bold m-0 fs-5">Dune: Part Two</h4>
                  <span
                    className="badge text-uppercase fw-bold"
                    style={{
                      background: 'rgba(139, 92, 246, 0.18)',
                      color: '#c084fc',
                      fontSize: '0.65rem',
                      borderRadius: 9999,
                    }}
                  >
                    DOLBY SUITE 4
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="text-secondary small">Dolby Cinema + Recliner Loungers with Tactile Bass</span>
                  <span className="badge bg-success bg-opacity-25 text-success small" style={{ fontSize: '0.65rem' }}>
                    SEATS AVAILABLE
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <Link
                    to={`/movies/${spotlightMovie._id}`}
                    className="btn btn-cinema-outline d-flex flex-column align-items-center py-2 px-3 rounded-3"
                    style={{ minWidth: 95 }}
                  >
                    <span className="fw-bold" style={{ fontSize: '0.95rem' }}>
                      13:15
                    </span>
                    <span className="small opacity-75 text-secondary" style={{ fontSize: '0.7rem' }}>
                      Dolby Vision
                    </span>
                  </Link>

                  <Link
                    to={`/movies/${spotlightMovie._id}`}
                    className="btn btn-cinema-outline d-flex flex-column align-items-center py-2 px-3 rounded-3"
                    style={{ minWidth: 95 }}
                  >
                    <span className="fw-bold" style={{ fontSize: '0.95rem' }}>
                      16:45
                    </span>
                    <span className="small opacity-75 text-secondary" style={{ fontSize: '0.7rem' }}>
                      Dolby Vision
                    </span>
                  </Link>

                  <Link
                    to={`/movies/${spotlightMovie._id}`}
                    className="btn btn-cinema-outline d-flex flex-column align-items-center py-2 px-3 rounded-3"
                    style={{ minWidth: 95 }}
                  >
                    <span className="fw-bold" style={{ fontSize: '0.95rem' }}>
                      20:15
                    </span>
                    <span className="small opacity-75 text-secondary" style={{ fontSize: '0.7rem' }}>
                      VIP Only
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Fast Seat Picker Widget */}
          <div className="col-lg-6">
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="text-white fw-bold m-0">Fast Seat Picker</h5>
                    <span className="text-secondary small">
                      Screen 1 &bull; {spotlightMovie.title} ({selectedShowtime})
                    </span>
                  </div>
                  <span className="pulse-indicator-emerald" title="Live Seating Synchronized"></span>
                </div>

                {/* Curved Laser Screen projection header */}
                <div className="text-center my-3">
                  <div
                    className="mx-auto"
                    style={{
                      height: 8,
                      width: '78%',
                      background: 'linear-gradient(to bottom, #ffffff, rgba(0, 242, 254, 0.4))',
                      borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                      boxShadow: '0 4px 20px rgba(0, 242, 254, 0.6)',
                    }}
                  />
                  <div className="text-uppercase tracking-widest text-secondary mt-1 fw-bold" style={{ fontSize: '0.62rem' }}>
                    CURVED LASER SCREEN
                  </div>
                </div>

                {/* Interactive Mini Seat Grid */}
                <div className="d-flex flex-column gap-2 align-items-center my-4">
                  {['A', 'B', 'C'].map((rowLabel) => (
                    <div key={rowLabel} className="d-flex align-items-center gap-2">
                      <span className="text-secondary fw-bold small user-select-none" style={{ width: 14 }}>
                        {rowLabel}
                      </span>
                      <div className="d-flex gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                          const seatId = `${rowLabel}${num}`;
                          const isSelected = selectedFastSeats.includes(seatId);
                          const isBooked = (rowLabel === 'A' && num === 3) || (rowLabel === 'C' && num === 7);

                          return (
                            <button
                              key={seatId}
                              type="button"
                              disabled={isBooked}
                              onClick={() => toggleFastSeat(seatId)}
                              className="border-0 p-0 rounded-2 transition-all d-inline-flex align-items-center justify-content-center"
                              style={{
                                width: 26,
                                height: 26,
                                background: isSelected
                                  ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                                  : isBooked
                                  ? '#1e293b'
                                  : 'rgba(255, 255, 255, 0.1)',
                                color: isSelected ? '#ffffff' : '#94a3b8',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                cursor: isBooked ? 'not-allowed' : 'pointer',
                                boxShadow: isSelected ? '0 0 12px rgba(37, 99, 235, 0.8)' : 'none',
                                transform: isSelected ? 'scale(1.15)' : 'none',
                              }}
                              title={`Seat ${seatId} ${isSelected ? '(Selected)' : isBooked ? '(Booked)' : '(Available)'}`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="d-flex justify-content-center align-items-center gap-3 pt-2 text-secondary small">
                  <div className="d-flex align-items-center gap-1">
                    <span className="rounded-1" style={{ width: 12, height: 12, background: 'rgba(255, 255, 255, 0.15)' }}></span>
                    <span style={{ fontSize: '0.72rem' }}>Available</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span className="rounded-1" style={{ width: 12, height: 12, background: 'var(--cinema-blue)' }}></span>
                    <span style={{ fontSize: '0.72rem' }}>Selected ({selectedFastSeats.length})</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span className="rounded-1" style={{ width: 12, height: 12, background: '#1e293b' }}></span>
                    <span style={{ fontSize: '0.72rem' }}>Occupied</span>
                  </div>
                </div>
              </div>

              {/* Subtotal and Proceed CTA */}
              <div className="d-flex justify-content-between align-items-center pt-3 mt-4 border-top border-white border-opacity-10">
                <div>
                  <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                    Seats: {selectedFastSeats.join(', ') || 'None selected'}
                  </div>
                  <div className="text-white fw-black fs-4" style={{ color: 'var(--cinema-cyan)' }}>
                    ${fastSeatSubtotal}{' '}
                    <span className="text-secondary small fw-normal" style={{ fontSize: '0.72rem' }}>
                      total
                    </span>
                  </div>
                </div>

                <Link
                  to={`/movies/${spotlightMovie._id}`}
                  className="btn btn-cinema px-4 py-2"
                >
                  Proceed to Pay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRAILER MODAL */}
      {trailerOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 1060 }}
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="glass-panel p-3 w-100"
            style={{ maxWidth: 840 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white m-0 fw-bold">{spotlightMovie.title} - Official 4K Trailer</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setTrailerOpen(false)}
              ></button>
            </div>
            <div className="ratio ratio-16x9 rounded-3 overflow-hidden">
              <iframe
                src={
                  spotlightMovie.trailerUrl.includes('watch?v=')
                    ? spotlightMovie.trailerUrl.replace('watch?v=', 'embed/') + '?autoplay=1'
                    : spotlightMovie.trailerUrl
                }
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

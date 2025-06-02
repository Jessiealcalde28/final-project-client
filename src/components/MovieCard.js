// MovieCard.js
import React, { useState } from 'react';

const MovieCard = ({ movie, onDelete, onToggleWatched, onEdit, onToggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    backgroundColor: '#1f2833',
    borderRadius: '16px',
    padding: 'clamp(1.5rem, 3vw, 2rem)',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    color: '#c5c6c7',
    border: '1px solid #2d3a4a',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-3px)' : 'none',
    boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.2)' : 'none',
    boxSizing: 'border-box',
  };

  const titleStyle = {
    fontSize: 'clamp(1.2rem, 4vw, 1.4rem)',
    fontWeight: '600',
    marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
    color: '#66fcf1',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
  };

  const ratingStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    marginBottom: 'clamp(0.3rem, 1vw, 0.5rem)',
  };

  const btnStyle = {
    background: 'linear-gradient(45deg, #45a29e, #3b8b87)',
    border: 'none',
    color: '#0b0c10',
    padding: 'clamp(0.5rem, 2vw, 0.6rem) clamp(1rem, 3vw, 1.2rem)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.3rem, 1vw, 0.5rem)',
    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
    width: '100%',
  };

  const editBtnStyle = {
    ...btnStyle,
    background: 'linear-gradient(45deg, #f0ad4e, #ec971f)', // gold/orange gradient
  };

  const favoriteBtnStyle = {
    ...btnStyle,
    background: movie.is_favorite
      ? 'linear-gradient(45deg, #ffcc00, #ffaa00)'  // bright gold when favorite
      : 'linear-gradient(45deg, #444444, #666666)',  // gray when not
  };


  

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 style={titleStyle}>
        {movie.watched ? '✅' : '⏳'}
        {movie.title} ({movie.release_year || 'N/A'})
      </h2>
      <div style={{ display: 'grid', gap: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
        <p>🎭 {movie.genre || 'Genre not specified'}</p>
        <p>📝 {movie.notes || 'No additional notes'}</p>
        <div style={ratingStyle}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                color: i < movie.rating ? '#ffd700' : '#4a4a4a',
              }}
            >
              ★
            </span>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 'clamp(0.5rem, 2vw, 1rem)',
            marginTop: 'clamp(0.5rem, 2vw, 1rem)',
            flexWrap: 'wrap',
          }}
        >
          <button
            style={btnStyle}
            onClick={() => onToggleWatched(movie)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 252, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {movie.watched ? 'Mark Unwatched' : 'Mark Watched'}
          </button>
          <button
            style={editBtnStyle}
            onClick={() => onEdit(movie)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(240, 173, 78, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Edit
          </button>
          <button
            style={favoriteBtnStyle}
            onClick={() => onToggleFavorite(movie)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = movie.is_favorite
                ? '0 4px 12px rgba(255, 204, 0, 0.6)'
                : '0 4px 12px rgba(100, 100, 100, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {movie.is_favorite ? '★ Favorite' : '☆ Favorite'}
          </button>
          <button
            style={{
              ...btnStyle,
              background: 'linear-gradient(45deg, #ff6b6b, #ff5252)',
            }}
            onClick={() => onDelete(movie.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

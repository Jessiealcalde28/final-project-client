import React, { useEffect, useState, useCallback } from 'react';
import MovieCard from './components/MovieCard';

function App() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: '',
    genre: '',
    release_year: '',
    notes: '',
    rating: 1,
  });
  const [user, setUser] = useState(null);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);
  const [editingMovieId, setEditingMovieId] = useState(null);

  const API_BASE = 'http://localhost:5000';

  const genreOptions = [
    '',
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'Documentary',
    'Animation',
  ];

  const yearOptions = [
    '',
    ...Array.from(
      { length: new Date().getFullYear() - 1979 },
      (_, i) => (1980 + i).toString()
    ),
  ];

  const addMovie = async (movie) => {
    await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
  };

  const updateMovie = async (id, updatedMovie) => {
    await fetch(`${API_BASE}/movies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMovie),
    });
  };

  const deleteMovie = async (id) => {
    await fetch(`${API_BASE}/movies/${id}`, { method: 'DELETE' });
  };

 const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = token ? parseJwt(token) : null;
    if (userInfo?.username) {
      setUser(userInfo.username);
    }
  }, []);

  const fetchMovies = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/movies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch movies');
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
  }, []);

  useEffect(() => {
    if (user) fetchMovies();
  }, [user, fetchMovies]);

  const resetForm = () => {
    setForm({ title: '', genre: '', release_year: '', notes: '', rating: 1 });
    setEditingMovieId(null);
  };

  const handleAddOrUpdateMovie = async (e) => {
    e.preventDefault();
    if (editingMovieId) {
      await updateMovie(editingMovieId, form);
    } else {
      await addMovie(form);
    }
    resetForm();
    fetchMovies();
  };

  const handleEditClick = (movie) => {
    setForm({
      title: movie.title,
      genre: movie.genre,
      release_year: movie.release_year,
      notes: movie.notes,
      rating: movie.rating,
    });
    setEditingMovieId(movie.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    await deleteMovie(id);
    fetchMovies();
  };

  const handleToggleWatched = async (movie) => {
    await updateMovie(movie.id, { ...movie, watched: !movie.watched });
    fetchMovies();
  };

  const handleToggleFavorite = async (movie) => {
    try {
      const updatedMovie = { ...movie, is_favorite: !movie.is_favorite };
      await fetch(`${API_BASE}/movies/${movie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovie),
      });
      fetchMovies();
    } catch (err) {
      console.error('Failed to update favorite', err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authForm),
    });

    const data = await res.json();
    if (res.ok) {
      if (isLogin) {
        setUser(data.username);
        localStorage.setItem('token', data.token);
      } else {
        alert('Registered successfully! Please login.');
        setIsLogin(true);
        setAuthForm({ username: '', password: '' });
      }
    } else {
      alert(data.error || 'Auth failed');
    }
  };

  const styles = {
    container: {
      backgroundColor: '#0b0c10',
      color: '#c5c6c7',
      minHeight: '100vh',
      padding: 'clamp(1rem, 5vw, 2rem)',
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
      maxWidth: '1200px',
      margin: '0 auto',
      boxSizing: 'border-box',
    },
    header: {
      fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
      fontWeight: '800',
      marginBottom: '1.5rem',
      background: 'linear-gradient(45deg, #66fcf1, #45a29e)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.05em',
    },
    welcome: {
      marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
      fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: '#1f2833aa',
      borderRadius: '12px',
      backdropFilter: 'blur(8px)',
    },
    logoutButton: {
      background: 'linear-gradient(45deg, #45a29e, #3b8b87)',
      border: 'none',
      color: '#0b0c10',
      fontWeight: '600',
      padding: 'clamp(0.5rem, 2vw, 0.6rem) clamp(1rem, 3vw, 1.4rem)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: 'clamp(0.8rem, 3vw, 1rem)',
    },
    form: {
      marginBottom: 'clamp(2rem, 5vw, 3rem)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
      gap: 'clamp(1rem, 3vw, 1.5rem)',
      background: '#1f2833',
      padding: 'clamp(1rem, 3vw, 2rem)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    },
    input: {
      padding: 'clamp(0.8rem, 2vw, 1rem)',
      borderRadius: '8px',
      border: '1px solid #2d3a4a',
      background: '#0b0c10',
      color: '#c5c6c7',
      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
      transition: 'all 0.3s ease',
      width: '100%',
      boxSizing: 'border-box',
    },
    submitBtn: {
      background: 'linear-gradient(45deg, #45a29e, #3b8b87)',
      color: '#0b0c10',
      fontWeight: '600',
      padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      gridColumn: '1 / -1',
      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
    },
    cancelBtn: {
      background: '#721c24',
      color: '#f5c6cb',
      fontWeight: '600',
      padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      gridColumn: '1 / -1',
      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
      marginTop: '-1rem',
    },
    authContainer: {
      width: '90%',
      maxWidth: '440px',
      margin: '4rem auto',
      background: 'linear-gradient(145deg, #1a2029, #1f2833)',
      padding: 'clamp(1.5rem, 4vw, 2.5rem)',
      borderRadius: '20px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
      border: '1px solid #2d3a4a',
    },
    authInput: {
      width: '100%',
      padding: 'clamp(0.8rem, 2vw, 1rem)',
      marginBottom: '1rem',
      borderRadius: '8px',
      border: '1px solid #2d3a4a',
      background: '#0b0c10',
      color: '#c5c6c7',
      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
      boxSizing: 'border-box',
    },
    authButton: {
      width: '100%',
      padding: 'clamp(0.8rem, 2vw, 1rem)',
      background: 'linear-gradient(45deg, #45a29e, #3b8b87)',
      color: '#0b0c10',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
    },
    toggleAuthBtn: {
      background: 'none',
      border: 'none',
      color: '#66fcf1',
      textDecoration: 'underline',
      cursor: 'pointer',
      paddingLeft: 0,
      marginTop: '1rem',
      fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
      fontWeight: '600',
    },
  };

  if (!user) {
    return (
      <div style={styles.authContainer}>
        <h2 style={{ marginBottom: '1rem' }}>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleAuth}>
          <input
            type="text"
            placeholder="Username"
            style={styles.authInput}
            value={authForm.username}
            onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
            required
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.authInput}
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
          <button type="submit" style={styles.authButton}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <button
          style={styles.toggleAuthBtn}
          onClick={() => setIsLogin(!isLogin)}
          type="button"
        >
          {isLogin ? 'Create an account' : 'Back to login'}
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Movie Watchlist App</h1>
      <div style={styles.welcome}>
        <p>
          Welcome, <strong>{user}</strong>
        </p>
        <button
          style={styles.logoutButton}
          onClick={() => {
            setUser(null);
            localStorage.removeItem('token');
          }}
        >
          Logout
        </button>
      </div>

      <form style={styles.form} onSubmit={handleAddOrUpdateMovie}>
        <input
          type="text"
          placeholder="Movie title"
          style={styles.input}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <select
          style={styles.input}
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
          required
        >
          {genreOptions.map((option) => (
            <option key={option} value={option}>
              {option || 'Select genre'}
            </option>
          ))}
        </select>
        <select
          style={styles.input}
          value={form.release_year}
          onChange={(e) => setForm({ ...form, release_year: e.target.value })}
          required
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year || 'Select year'}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Notes"
          rows={3}
          style={{ ...styles.input, resize: 'vertical' }}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <input
          type="number"
          min={1}
          max={5}
          style={styles.input}
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          required
        />
        <button type="submit" style={styles.submitBtn}>
          {editingMovieId ? 'Update Movie' : 'Add Movie'}
        </button>
        {editingMovieId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
        )}
      </form>

      <main>
        {movies.length === 0 ? (
          <p>No movies yet.</p>
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDelete={handleDelete}
              onToggleWatched={handleToggleWatched}
              onEdit={handleEditClick}
              onToggleFavorite={handleToggleFavorite} 
            />
          ))
        )}
      </main>
    </div>
  );
}

export default App;

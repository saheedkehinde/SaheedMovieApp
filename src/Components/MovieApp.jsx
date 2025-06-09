import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

// MovieApp component that allows users to search and filter movies by genre and release date
// It includes a search bar, genre filter, and date picker  

const API_KEY = "04be35c047aa463ae1f2d338852f5ffb";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

export default function MovieApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch genres on mount
  useEffect(() => {
    fetch(GENRE_URL)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres))
      .catch((err) => console.error("Genre fetch error:", err));
  }, []);

  // Fetch movies when any filter changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      const baseURL = searchTerm
        ? `https://api.themoviedb.org/3/search/movie`
        : `https://api.themoviedb.org/3/discover/movie`;

      const params = new URLSearchParams({
        api_key: API_KEY,
        language: "en-US",
        page: page.toString(),
        ...(searchTerm && { query: searchTerm }),
        ...(selectedGenre && { with_genres: selectedGenre }),
        ...(releaseDate && { primary_release_year: releaseDate.split("-")[0] }),
      });

      try {
        const response = await fetch(`${baseURL}?${params.toString()}`);
        const data = await response.json();
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm, selectedGenre, releaseDate, page]);

  const handleSearchKey = (e) => {
    if (e.key === "Enter") {
      setPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0080ff] text-gray-800 p-6">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-white">🎬 Movie Explorer</h1>
        <p className="text-lg text-white mt-1">Search movies with filters</p>
      </header>

      <div className="w-full bg-white shadow-md rounded-xl p-6 mb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center border border-blue-300 rounded-md px-3 py-2">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKey}
              className="flex-1 outline-none"
            />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setPage(1);
            }}
            className="border border-blue-300 rounded-md px-3 py-2"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={releaseDate}
            onChange={(e) => {
              setReleaseDate(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-2"
          />

          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedGenre("");
              setReleaseDate("");
              setPage(1);
            }}
            className="bg-red-500 text-blue px-3 py-2 rounded-md hover:bg-red-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading movies...</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-gray-500">No movies found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-50 rounded-lg shadow hover:shadow-md transition p-4"
            >
              <img
                src={
                  movie.poster_path
                    ? `${IMAGE_BASE_URL}${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
                className="h-60 w-full object-cover rounded mb-3"
              />
              <h2 className="text-lg font-semibold mb-1">{movie.title}</h2>
              <p className="text-sm text-gray-600 mb-1">
                ⭐ {movie.vote_average} • {movie.release_date}
              </p>
              <p className="text-sm text-gray-700 line-clamp-3">
                {movie.overview || "No description available."}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className={`px-4 py-2 rounded ${
            page <= 1
              ? "bg-gray-300 text-blue-500 cursor-not-allowed"
              : "bg-indigo-500 text-blue hover:bg-indigo-600"
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-blue-700 mt-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded ${
            page >= totalPages
              ? "bg-gray-300 text-blue-500 cursor-not-allowed"
              : "bg-indigo-500 text-blue hover:bg-indigo-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
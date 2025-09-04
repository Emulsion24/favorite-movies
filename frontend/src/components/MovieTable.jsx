import React, { useEffect, useState } from "react";

export default function MovieTable() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState({ type: "", year: "" });
  const [search, setSearch] = useState("");

  // Sample movie data
  const sampleMovies = [
    { id: 1, title: "Inception", type: "Movie", director: "Christopher Nolan", year: 2010 },
    { id: 2, title: "The Dark Knight", type: "Movie", director: "Christopher Nolan", year: 2008 },
    { id: 3, title: "Stranger Things", type: "TV Show", director: "The Duffer Brothers", year: 2016 },
    { id: 4, title: "Breaking Bad", type: "TV Show", director: "Vince Gilligan", year: 2008 },
    { id: 5, title: "Interstellar", type: "Movie", director: "Christopher Nolan", year: 2014 },
    { id: 6, title: "Money Heist", type: "TV Show", director: "Álex Pina", year: 2017 },
  ];

  useEffect(() => {
    // Simulate fetching from backend
    const filteredMovies = sampleMovies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(search.toLowerCase()) ||
        movie.director.toLowerCase().includes(search.toLowerCase());
      const matchesType = filter.type ? movie.type.toLowerCase() === filter.type.toLowerCase() : true;
      const matchesYear = filter.year ? movie.year === Number(filter.year) : true;
      return matchesSearch && matchesType && matchesYear;
    });

    setMovies(filteredMovies);
  }, [filter, search]);

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title or director..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded w-full text-black"
        />
        <select
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="px-4 py-2 rounded"
        >
          <option value="">All Types</option>
          <option value="Movie">Movie</option>
          <option value="TV Show">TV Show</option>
        </select>
        <input
          type="number"
          placeholder="Year"
          onChange={(e) => setFilter({ ...filter, year: e.target.value })}
          className="px-4 py-2 rounded"
        />
      </div>
      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Type</th>
            <th className="p-2">Director</th>
            <th className="p-2">Year</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id} className="border-b border-gray-600 hover:bg-gray-600">
              <td className="p-2">{movie.title}</td>
              <td className="p-2">{movie.type}</td>
              <td className="p-2">{movie.director}</td>
              <td className="p-2">{movie.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

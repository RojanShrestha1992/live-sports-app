import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStreamsById } from "../api/api";
import API from "../api/api";
import { FaStar } from "react-icons/fa";

const CategoryMatches = () => {
  const { id } = useParams();
  const [matches, setMatches] = useState([]);
  const [showPopular, setShowPopular] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await getStreamsById(id);
        setMatches(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [id]);

  if (loading) return <p className="text-white text-center py-6">Loading...</p>;
  if (!matches.length)
    return <p className="text-white text-center py-6">No matches found.</p>;

  // ----- Group matches by date -----
  const getDateLabel = (timestamp) => {
    const matchDate = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (
      matchDate >= today &&
      matchDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
    ) {
      return "Today";
    } else if (
      matchDate >= tomorrow &&
      matchDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
    ) {
      return "Tomorrow";
    } else {
      return matchDate.toLocaleDateString();
    }
  };

  const groupedMatches = matches
    .filter((match) => (showPopular ? match.popular : true)) // apply popular filter
    .reduce((acc, match) => {
      const label = getDateLabel(match.date);
      if (!acc[label]) acc[label] = [];
      acc[label].push(match);
      return acc;
    }, {});

  // ----- Render -----
  return (
    <section className="p-6 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Matches</h2>
        <button
          onClick={() => setShowPopular(!showPopular)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full transition shadow focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {showPopular ? "Show All" : "Show Popular"}
        </button>
      </div>

      {/* Render each date group */}
      {Object.entries(groupedMatches).map(([dateLabel, matchesForDate]) => (
        <div key={dateLabel} className="mb-10">
          <h3 className="text-xl font-semibold text-white mb-4">{dateLabel}</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {matchesForDate.map((match) => (
              <div
                key={match.id}
                onClick={() =>
                  navigate(`/match/${match.id}`, { state: { match, categoryId : match.category } })
                }
                className="relative group overflow-hidden rounded-lg cursor-pointer transform hover:bg-slate-800 transition duration-300 min-h-[250px]"
              >
                {/* Poster */}
                <img
                  src={`${API.defaults.baseURL}${match.poster}`}
                  alt={match.title}
                  className="w-full object-contain group-hover:scale-110 transition-transform duration-400 bg-gray-800"
                />

                {/* Popular star */}
                {match.popular && (
                  <div className="absolute top-2 right-2 text-yellow-500">
                    <FaStar />
                  </div>
                )}

                {/* Match info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {match.title}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {match.category.toUpperCase()} •{" "}
                    {new Date(match.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default CategoryMatches;

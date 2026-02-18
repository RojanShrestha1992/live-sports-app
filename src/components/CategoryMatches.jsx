import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStreamsById } from "../api/api";
import API from "../api/api";

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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          No matches available in this category.
        </div>
      </div>
    );
  }

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
    .filter((match) => (showPopular ? match.popular : true))
    .reduce((acc, match) => {
      const label = getDateLabel(match.date);
      if (!acc[label]) acc[label] = [];
      acc[label].push(match);
      return acc;
    }, {});

  return (
    <section className="w-full py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{matches[0]?.category.toUpperCase() || "Category"} Matches</h1>
            <p className="text-gray-400 text-sm">{matches.length} matches available</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowPopular(!showPopular)}
              className={`px-8 py-4 rounded-lg font-semibold text-base transition-all ${
                showPopular
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-gray-300 border border-slate-700 hover:border-blue-500"
              }`}
            >
              {showPopular ? "All Matches" : "Popular Only"}
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-lg bg-slate-800 text-gray-300 border border-slate-700 hover:border-gray-500 font-semibold text-base transition-all"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Matches Grid */}
        {Object.entries(groupedMatches).length > 0 ? (
          Object.entries(groupedMatches).map(([dateLabel, matchesGroup], dateIdx) => (
            <div key={dateLabel} className="mb-12">
              <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                {dateLabel}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {matchesGroup.map((match, idx) => (
                  <button
                    key={match.id}
                    onClick={() =>
                      navigate(`/match/${match.id}`, {
                        state: { match, categoryId: match.category },
                      })
                    }
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${(dateIdx * 0.1 + idx * 0.05)}s both`
                    }}
                    className="group text-left focus:outline-none"
                  >
                    <div className="relative mb-3 overflow-hidden rounded-lg bg-slate-800">
                      {/* Image */}
                      <img
                        src={match.poster ? `${API.defaults.baseURL}${match.poster}` : "/placeholder.png"}
                        alt={match.title}
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>

                      {/* Badge */}
                      {match.popular && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          ★ POPULAR
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {match.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {match.category.toUpperCase()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            No matches found for the selected filters.
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryMatches;

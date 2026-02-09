import React, { useEffect, useState } from "react";
import API, { getPopularMatches } from "../api/api";
import { useNavigate } from "react-router-dom";

const PopularNow = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Group matches by date
  const groupedMatches = matches.reduce((acc, match) => {
    const dateKey = getDateLabel(match.date);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {});

  useEffect(() => {
    const fetchPopularMatches = async () => {
      try {
        const res = await getPopularMatches();
        setMatches(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularMatches();
  }, []);

  if (loading) {
    return <p className="text-white text-center py-6">Loading popular matches...</p>;
  }

  if (!matches.length) {
    return <p className="text-white text-center py-6">No popular matches available.</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="font-bold text-3xl text-white mb-8">Popular Now</h1>

      {Object.entries(groupedMatches).map(([date, matches]) => (
        <div key={date} className="mb-10">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">{date}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {matches.map((match) => (
              <div
                key={match.id}
                onClick={() =>
                  navigate(`/match/${match.id}`, {
                    state: { match, categoryId: match.category },
                  })
                }
                className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative">
                  <img
                    src={match.poster ? `${API.defaults.baseURL}${match.poster}` : "/placeholder.png"}
                    alt={match.title || "Match Poster"}
                    className="w-full h-32 object-cover aspect-video bg-gray-700"
                  />
                  {match.popular && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 rounded-full px-2 py-1 text-xs font-bold">
                      ★ Popular
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-white font-semibold text-lg mb-1 truncate">{match.title}</p>
                  <p className="text-gray-400 text-sm">
                    {match.category.toUpperCase()} • {new Date(match.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopularNow;

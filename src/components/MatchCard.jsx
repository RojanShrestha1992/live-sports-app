import React, { useEffect, useState } from "react";
import { getLiveStreamBySource } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";

const MatchCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.state?.match;

  const [streams, setStreams] = useState([]);
  const [currentStream, setCurrentStream] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (streams.length) {
      setCurrentStream(0);
    }
  }, [streams]);

  useEffect(() => {
    if (!match || !match.sources || !match.sources.length) {
      setLoading(false);
      return;
    }

    const fetchStreams = async () => {
      try {
        const results = await Promise.all(
          match.sources.map(async (sourceObj) => {
            try {
              const res = await getLiveStreamBySource(sourceObj.source, sourceObj.id);
              return res.data;
            } catch (err) {
              console.log(`Source ${sourceObj.source} failed:`, err);
              return null;
            }
          })
        );
        const availableStreams = results.flat().filter(Boolean);
        setStreams(availableStreams);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStreams();
  }, [match]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading stream...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Watch Live</h1>
            <p className="text-gray-400 text-sm">{match?.title}</p>
          </div>
          <button
            onClick={() => {
                if (match?.categoryId) {
                  navigate(`/category/${match.categoryId}`);
                } else {
                  navigate(-1);
                }
            }}
            className="px-6 py-3 rounded-lg bg-slate-800 text-gray-300 border border-slate-700 hover:border-gray-500 font-semibold text-base transition-all"
          >
            ← Back
          </button>
        </div>

        {/* Video Player */}
        <div className="mb-8 rounded-xl overflow-hidden bg-black border border-slate-800">
          {streams[currentStream]?.embedUrl ? (
            <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
              <iframe
                allowFullScreen
                src={streams[currentStream].embedUrl}
                title={streams[currentStream].id}
                className="absolute top-0 left-0 w-full h-full border-0"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-slate-900">
              <div className="text-center">
                <p className="text-gray-400 mb-2">No stream available</p>
              </div>
            </div>
          )}
        </div>

        {/* Info & Stream Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Match Info */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
              <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase">Match Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Category</p>
                  <p className="text-white font-semibold">{match?.category?.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Date & Time</p>
                  <p className="text-white font-semibold">
                    {new Date(match?.date).toLocaleDateString()} {new Date(match?.date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Teams */}
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
              <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase">Teams</h3>
              <div className="space-y-4">
                {/* Home */}
                <div className="flex items-center gap-3">
                  <img
                    src={`${API.defaults.baseURL}/api/images/proxy/${match?.teams?.home.badge}.webp`}
                    alt={match?.teams?.home.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <span className="text-white font-semibold text-sm">{match?.teams?.home.name}</span>
                </div>

                <div className="text-center text-gray-400 text-xs font-semibold">VS</div>

                {/* Away */}
                <div className="flex items-center gap-3">
                  <img
                    src={`${API.defaults.baseURL}/api/images/proxy/${match?.teams?.away.badge}.webp`}
                    alt={match?.teams?.away.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                  <span className="text-white font-semibold text-sm">{match?.teams?.away.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Stream Selection */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
              <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase">Available Streams</h3>

              {streams.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {streams.map((stream, index) => (
                      <button
                        key={stream.id}
                        onClick={() => setCurrentStream(index)}
                        className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all flex flex-col items-center justify-center min-h-20 ${
                          currentStream === index
                            ? "bg-blue-600 text-white border border-blue-500"
                            : "bg-slate-800 text-gray-300 border border-slate-700 hover:border-blue-500"
                        }`}
                      >
                        <div className="font-semibold">{stream.source.toUpperCase()}</div>
                        <div className="text-xs mt-1">
                          {stream.hd ? "HD" : "SD"} • {stream.language}
                        </div>
                      </button>
                    ))}
                  </div>

                  {streams[currentStream] && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-gray-400 text-xs">
                        <span className="text-green-400 font-semibold">✓</span> Stream ready to play
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No streams available at the moment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatchCard;

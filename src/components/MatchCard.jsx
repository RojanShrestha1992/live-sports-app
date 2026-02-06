import React, { useEffect, useState } from "react";
import { getLiveStreamBySource } from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";
const MatchCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const match = location.state?.match; // Access the match object passed from CategoryMatches
  const categoryId = location.state?.categoryId; // Access the category ID passed from CategoryMatches

  //   console.log(id)
  //   console.log("MatchCard ID: ", id);
  const [streams, setStreams] = useState([]);
  const [currentStream, setCurrentStream] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Streams fetched:", streams);
  }, [streams]);

  useEffect(() => {
    if (streams.length) {
      setCurrentStream(0); // select the first stream automatically
    }
  }, [streams]);

  //fetch streams for all sources
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
              const res = await getLiveStreamBySource(
                sourceObj.source,
                sourceObj.id,
              );
              //   console.log("matchcard: ", res.data);
              return res.data;
            } catch (err) {
              console.log(`Source ${sourceObj.source} failed:`, err);

              return null;
            }
          }),
        );
        //remove nuulls
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

  if (loading) return <p className="text-white text-center py-6">Loading...</p>;
  //   if (!streams.length)
  //     return (
  //       <p className="text-white text-center py-6">
  //         No streams available for this match.
  //       </p>
  //     );

  
  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
        <div>
          <h1 className="text-3xl font-bold mb-6">Watch Match Live</h1>
          <div className="mb-5">
            <button
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
              onClick={() => {
                if (categoryId) {
                  navigate(`/category/${categoryId}`);
                } else {
                  navigate(-1);
                }
              }}
            >
              Go Back
            </button>
          </div>
          <p className="text-gray-300 mb-2">
            Cateory: {match?.category.toUpperCase()} • Date:{" "}
            {new Date(match.date).toLocaleDateString()}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Teams</h2>
          <div className="flex items-center gap-4">
            <img
              src={`${API.defaults.baseURL}/api/images/proxy/${match.teams?.home.badge}.webp`}
              alt={match.teams?.home.name}
              className="w-16 h-16 object-contain"
            />
            <p className="text-white">{match.teams?.home.name}</p>
            <span className="text-white font-bold">VS</span>
            <p className="text-white">{match.teams?.away.name}</p>
            <img
              src={`${API.defaults.baseURL}/api/images/proxy/${match.teams?.away.badge}.webp`}
              alt={match.teams?.away.name}
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
      </div>

      {/* select source */}
      {streams.length ? (
        <div className="flex gap-3 mb-6 flex-wrap">
          {streams.map((stream, index) => (
            <button
              key={stream.id}
              onClick={() => setCurrentStream(index)}
              className={`px-3 py-1 rounded-lg cursor-pointer ${currentStream === index ? "bg-blue-500" : "bg-gray-700"}`}
            >
              {stream.source.toUpperCase()} {stream.hd ? "HD" : "SD"} (
              {stream.language})
            </button>
          ))}
        </div>
      ) : (
        <p className="text-white text-center py-6">
          {" "}
          No streams available for this match.
        </p>
      )}

      {streams[currentStream] && (
        <div className="relative pt-[56.25%]">
          <iframe
            allowFullScreen
            src={streams[currentStream].embedUrl}
            title={streams[currentStream].id}
            className="absolute top-0 left-0 w-full h-full rounded-lg border-0"
            frameborder="0"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default MatchCard;

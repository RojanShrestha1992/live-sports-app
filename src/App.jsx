import React from "react";
import Category from "./components/Category";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoryMatches from "./components/CategoryMatches";
import MatchCard from "./components/MatchCard";

const App = () => {
  return (
    <>
      {" "}
      <div className="bg-slate-900 min-h-screen text-white">
      <Router>
        <Routes>
          <Route path="/" element={<Category />} />
          <Route path="/category/:id" element={<CategoryMatches />} />
          <Route path="/match/:match_id" element={<MatchCard />} />

        </Routes>
      </Router>
      </div>
    </>
  );
};

export default App;

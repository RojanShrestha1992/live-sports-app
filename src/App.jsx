import React from "react";
import Category from "./components/Category";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CategoryMatches from "./components/CategoryMatches";
import MatchCard from "./components/MatchCard";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    // <Router>
    //   <div className="min-h-screen bg-slate-950 text-white">
    //     <Navbar />
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/category/:id" element={<CategoryMatches />} />
    //       <Route path="/match/:match_id" element={<MatchCard />} />
    //     </Routes>
    //   </div>
    // </Router>
   <Router>
      <div className="min-h-screen bg-slate-950 text-white flex justify-center">
        <div className="w-full max-w-7xl px-6">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<CategoryMatches />} />
            <Route path="/match/:match_id" element={<MatchCard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;



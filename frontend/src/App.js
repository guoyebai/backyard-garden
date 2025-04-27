import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import PlantList from "./pages/PlantList";
import AddPlant from "./pages/AddPlant.js";
import GardenLayout from "./pages/GardenLayout.js"; 

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/plants">Plant List</Link></li>
                    <li><Link to="/add-plant">Add Plant</Link></li>
                    <li><Link to="/garden">Garden Layout</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/plants" element={<PlantList />} />
                <Route path="/add-plant" element={<AddPlant />} />
                <Route path="/garden" element={<GardenLayout />} />
            </Routes>
        </Router>
    );
}

export default App;

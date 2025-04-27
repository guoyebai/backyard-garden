import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Welcome to Backyard Garden Planner</h1>
            <p>Plan your garden efficiently!</p>
            <Link to="/plants">View Plant List</Link>
        </div>
    );
};

export default Home;

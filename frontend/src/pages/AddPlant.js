import React, { useState } from "react";
import axios from "axios";

const AddPlant = () => {
    const [name, setName] = useState("");
    const [sunlight, setSunlight] = useState("");
    const [waterNeeds, setWaterNeeds] = useState("");
    const [plantingSeason, setPlantingSeason] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/api/plants/", {
            name,
            sunlight,
            water_needs: waterNeeds,
            planting_season: plantingSeason
        }).then(() => {
            alert("Plant added successfully!");
            setName("");
            setSunlight("");
            setWaterNeeds("");
            setPlantingSeason("");
        }).catch(error => {
            console.error("Error adding plant:", error);
        });
    };

    return (
        <div>
            <h1>Add a New Plant</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <br />
                <label>
                    Sunlight:
                    <input type="text" value={sunlight} onChange={(e) => setSunlight(e.target.value)} required />
                </label>
                <br />
                <label>
                    Water Needs:
                    <input type="text" value={waterNeeds} onChange={(e) => setWaterNeeds(e.target.value)} required />
                </label>
                <br />
                <label>
                    Planting Season:
                    <input type="text" value={plantingSeason} onChange={(e) => setPlantingSeason(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Add Plant</button>
            </form>
        </div>
    );
};

export default AddPlant;

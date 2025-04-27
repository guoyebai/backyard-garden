import React, { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";

// Define the item types for dragging
const ItemTypes = {
    PLANT: "plant",
};

// Draggable Plant Component
const Plant = ({ plant, index, movePlant, addPlantToGrid, isAvailable }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.PLANT,
        item: isAvailable ? { plant } : { index }, // If from list, pass plant; if from grid, pass index
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            style={{
                width: "80px",
                height: "80px",
                backgroundColor: isDragging ? "lightgreen" : "green",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid black",
                cursor: "grab",
                margin: "5px",
            }}
        >
            <img src={plant.image} alt={plant.name} style={{ width: "60px", height: "60px" }} />
        </div>
    );
};

// Grid Cell Component (Drop Target)
const GridCell = ({ index, plant, movePlant, removePlant, addPlantToGrid }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.PLANT,
        drop: (item) => {
            if (item.index !== undefined) {
                // If dragged from the grid, move within the grid
                movePlant(item.index, index);
            } else if (item.plant) {
                // If dragged from the available list, add it to the grid
                addPlantToGrid(item.plant, index);
            }
        },
    });

    return (
        <div
            ref={drop}
            style={{
                width: "100px",
                height: "100px",
                border: "1px dashed gray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                backgroundColor: plant ? "#b0f2c2" : "white",
                position: "relative",
            }}
        >
            {plant && (
                <>
                    <Plant plant={plant} index={index} movePlant={movePlant} />
                    <button
                        onClick={() => removePlant(index)}
                        style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "12px",
                            padding: "2px 5px",
                        }}
                    >
                        X
                    </button>
                </>
            )}
        </div>
    );
};


// Main Garden Grid Layout Component
const GardenLayout = () => {
    const [rows, setRows] = useState(3); // Default rows
    const [cols, setCols] = useState(3); // Default columns
    const [grid, setGrid] = useState(Array(9).fill(null)); // Default grid with 9 cells
    const [plantList, setPlantList] = useState([]); // Default common plants
    const [searchQuery, setSearchQuery] = useState(""); // User search input
    const [searchResults, setSearchResults] = useState([]); // Search results

    // Fetch common plants on load
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/common-plants/")
            .then(response => setPlantList(response.data))
            .catch(error => console.error("Error fetching common plants:", error));
    }, []);

    // Search for plants
    const searchPlants = () => {
        if (!searchQuery) return;
        axios.get(`http://127.0.0.1:8000/api/search-plants/?query=${searchQuery}`)
            .then(response => setSearchResults(response.data))
            .catch(error => console.error("Error searching plants:", error));
    };

    const movePlant = (fromIndex, toIndex) => {
        const newGrid = [...grid];
        const plant = newGrid[fromIndex];
        newGrid[fromIndex] = null;
        newGrid[toIndex] = plant;
        setGrid(newGrid);
    };

    const addPlantToGrid = (plant, index = null) => {
        const emptyIndex = index !== null ? index : grid.findIndex((cell) => cell === null);
        if (emptyIndex !== -1) {
            const newGrid = [...grid];
            newGrid[emptyIndex] = plant;
            setGrid(newGrid);
        }
    };

    const removePlant = (index) => {
        const newGrid = [...grid];
        newGrid[index] = null;
        setGrid(newGrid);
    };

    const saveGardenLayout = () => {
        axios.post("http://127.0.0.1:8000/api/garden-layout/", { layout_data: grid })
            .then(() => alert("Garden layout saved!"))
            .catch(error => console.error("Error saving layout:", error));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <h1>Garden Layout</h1>

            {/* User Input for Grid Size */}
            <label>Rows: </label>
            <input
                type="number"
                min="1"
                value={rows}
                onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <label> Columns: </label>
            <input
                type="number"
                min="1"
                value={cols}
                onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button onClick={() => setGrid(Array(rows * cols).fill(null))}>Update Grid</button>

            {/* Render Grid Dynamically */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, 80px)`,
                    gap: "5px",
                    marginTop: "10px",
                }}
            >
                {grid.map((plant, index) => (
                    <GridCell
                        key={index}
                        index={index}
                        plant={plant}
                        movePlant={movePlant}
                        removePlant={removePlant}
                        addPlantToGrid={addPlantToGrid}
                    />
                ))}
            </div>

            <h2>Available Plants</h2>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {plantList.map((plant) => (
                    <Plant key={plant.id} plant={plant} isAvailable />
                ))}
            </div>


            <h2>Search for More Plants</h2>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button onClick={searchPlants}>Search</button>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {searchResults.map((plant) => (
                    <Plant key={plant.id} plant={plant} isAvailable addPlantToGrid={addPlantToGrid} />
                ))}
            </div>
            
            <button onClick={saveGardenLayout} style={{ marginTop: "20px" }}>
                Save Garden
            </button>
        </DndProvider>
    );    
};

export default GardenLayout;

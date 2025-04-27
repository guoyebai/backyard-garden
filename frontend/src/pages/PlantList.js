import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table } from "react-bootstrap";

const PlantList = () => {
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/plants/")
            .then(response => setPlants(response.data))
            .catch(error => console.error("Error:", error));
    }, []);

    return (
        <Container>
            <h1 className="my-4">Plant List</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Sunlight</th>
                        <th>Water Needs</th>
                    </tr>
                </thead>
                <tbody>
                    {plants.map((plant) => (
                        <tr key={plant.id}>
                            <td>{plant.name}</td>
                            <td>{plant.sunlight}</td>
                            <td>{plant.water_needs}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default PlantList;

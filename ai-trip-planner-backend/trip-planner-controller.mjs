import 'dotenv/config';
import express from 'express';
import { spawn } from 'child_process';
import * as trips from './trip-planner-model.mjs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT;
const PYTHON = process.env.PYTHON_PATH
const app = express();
console.log('Python Path:', PYTHON);  // Check if the path is correctly read

// Use CORS and JSON middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CREATE controller ******************************************
app.post('/trips', (req, res) => {
    trips.createTrip(
        req.body.country,
        req.body.startDate,
        req.body.endDate,
        req.body.tripType,
        req.body.itinerary
    )
        .then(trip => {
            console.log(`"${trip.country}" was added to the travel log collection with ID ${trip._id}.`);
            res.status(201).json(trip._id);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: `Failed to add trip. Ensure all fields are correctly filled. ${error.message}` });
        });
});

// GENERATE ITINERARY Controller ******************************
app.post('/plantrip', (req, res) => {
    console.log('Received request to generate itinerary');
    const tripId = req.body.id;
    console.log('Trip ID:', tripId)

    if (!tripId) {
        return res.status(400).json({ Error: 'Trip ID is required' });
    }

    // Construct the command to run the Python script
    const scriptPath = path.join(__dirname, 'generate_itinerary.py');

    // Call the Python script with the trip ID as an argument
    const pythonProcess = spawn(PYTHON, [scriptPath, tripId]);

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data.toString()}`);
        res.status(500).json({ Error: 'Error generating itinerary' });
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            res.status(500).json({ Error: 'Error generating itinerary' });
        } else {
            res.status(200).json({ Success: 'Itinerary generated successfully' });
        }
    });
});

// RETRIEVE controller ****************************************************
app.get('/trips', (req, res) => {
    trips.retrieveTrips()
        .then(trips => {
            if (trips !== null) {
                console.log(`All trips were retrieved from the travel log collection.`);
                res.json(trips);
            } else {
                res.status(404).json({ Error: "No trips found in the travel log collection." });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: "Unable to retrieve trips." });
        });
});

// RETRIEVE by ID controller
app.get('/trips/:_id', (req, res) => {
    trips.retrieveTripByID(req.params._id)
        .then(trip => {
            if (trip !== null) {
                console.log(`Trip to "${trip.country}" was retrieved, based on its ID.`);
                res.json(trip);
            } else {
                res.status(404).json({ Error: 'No trip found with this ID' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: "ID format is invalid or the trip does not exist" });
        });
});

// UPDATE controller ************************************
app.put('/trips/:_id', (req, res) => {
    trips.updateTrip(
        req.params._id,
        req.body.country,
        req.body.startDate,
        req.body.endDate,
        req.body.tripType,
        req.body.itinerary
    )
        .then(trip => {
            console.log(`"${trip.country}" was updated successfully.`);
            res.json(trip);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: "Update failed: Ensure all fields are filled correctly." });
        });
});

// DELETE Controller ******************************
app.delete('/trips/:_id', (req, res) => {
    trips.deleteTripById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                console.log(`Based on its ID, ${deletedCount} trip(s) was deleted.`);
                res.status(200).send({ Success: 'Trip successfully deleted.' });
            } else {
                res.status(404).json({ Error: `No trip found with ID ${req.params._id}.` });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: `Failed to delete trip due to server error.` });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

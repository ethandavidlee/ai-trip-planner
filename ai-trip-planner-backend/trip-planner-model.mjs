// Models for the Trip Collection

// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';

// Set the strictQuery option as recommended by the warning
mongoose.set('strictQuery', true);

// Connect based on the .env file parameters.
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once("open", (err) => {
    if (err) {
        console.log("Could not connect to the database.");
    } else {
        console.log('Success: Database connected.');
    }
});

// SCHEMA: Define the collection's schema.
const tripSchema = mongoose.Schema({
    country: { type: String, required: true },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true, default: Date.now },
    tripType: { type: String, required: true },
    itinerary: { type: String }
});

// Compile the model from the schema
// by defining the collection name "trips".
const Trip = mongoose.model('Trips', tripSchema);


// CREATE model *****************************************
const createTrip = async (country, startDate, endDate, tripType) => {
    const trip = new Trip({
        country: country,
        startDate: startDate,
        endDate: endDate,
        tripType: tripType
    });
    return trip.save();
}


// RETRIEVE model *****************************************
// Retrieve all documents and return a promise.
const retrieveTrips = async () => {
    const query = Trip.find();
    return query.exec();
}

// RETRIEVE by ID
const retrieveTripByID = async (_id) => {
    const query = Trip.findById({ _id });
    return query.exec();
}

// DELETE model based on _id  *****************************************
const deleteTripById = async (_id) => {
    const result = await Trip.deleteOne({ _id });
    return result.deletedCount;
};


// UPDATE model *****************************************************
const updateTrip = async (_id, country, startDate, endDate, tripType, itinerary) => {
    const result = await Trip.replaceOne({ _id }, {
        country: country,
        startDate: startDate,
        endDate: endDate,
        tripType: tripType,
        itinerary: itinerary
    });
    return {
        _id: _id,
        country: country,
        startDate: startDate,
        endDate: endDate,
        tripType: tripType,
        itinerary: itinerary
    }
}

// EXPORT the variables for use in the controller file.
export { createTrip, retrieveTrips, retrieveTripByID, updateTrip, deleteTripById, Trip }

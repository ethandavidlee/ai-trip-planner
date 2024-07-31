import sys
from datetime import datetime, timedelta
from pymongo import MongoClient
import os
from bson.objectid import ObjectId
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()  # Load environment variables from .env file

def generate_itinerary(country, start_date, end_date, trip_type, itinerary=None):
    print('Python is running')
    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        return "Invalid date format. Please use YYYY-MM-DD."

    num_days = end_date - start_date

    client = OpenAI(
        base_url = "https://integrate.api.nvidia.com/v1",
        api_key = "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"
        )

    if itinerary == '':
        completion = client.chat.completions.create(
            model="meta/llama-3.1-8b-instruct",
            messages=[{
                "role":"user",
                "content":f"Provide a travel itinerary for a {num_days.days}-day {trip_type}-focussed trip to {country} from {start_date.date()} to {end_date.date()}."
                }],
            temperature=0.2,
            top_p=0.7,
            max_tokens=1024,
            stream=True
        )
    
    else:
        completion = client.chat.completions.create(
            model="meta/llama-3.1-8b-instruct",
            messages=[{
                "role":"user",
                "content":f"Edit my travel itinerary for a {num_days.days}-day {trip_type}-focussed trip to {country} from {start_date.date()} to {end_date.date()}. Here is my current itinerary: {itinerary}. If there is no itinerary, create a new one."
                }],
            temperature=0.2,
            top_p=0.7,
            max_tokens=1024,
            stream=True
        )
    
    itinerary = ''

    for chunk in completion:
        if chunk.choices[0].delta.content is not None:
            itinerary += chunk.choices[0].delta.content
    
    print(itinerary)
    return itinerary

def get_trip_data_from_db(trip_id):
    # Connect to MongoDB
    client = MongoClient(os.getenv("MONGODB_CONNECT_STRING"))
    db = client.get_database()  # Use the default database from the connection string
    trips_collection = db["trips"]

     # Convert trip_id to ObjectId
    print (trip_id)
    try:
        trip_object_id = ObjectId(trip_id)
    except Exception as e:
        print(f"Invalid trip ID format: {e}")
        return None

    # Retrieve trip data by ID
    trip_data = trips_collection.find_one({"_id": trip_object_id})
    return trip_data

def save_itinerary_to_db(trip_id, itinerary):
    # Connect to MongoDB
    client = MongoClient(os.getenv("MONGODB_CONNECT_STRING"))
    db = client.get_database()  # Use the default database from the connection string
    trips_collection = db["trips"]

    # Convert trip_id to ObjectId
    trip_object_id = ObjectId(trip_id)

    # Update the trip's itinerary
    trips_collection.update_one({"_id": trip_object_id}, {"$set": {"itinerary": itinerary}})


if __name__ == "__main__":
    print('Python called')
    if len(sys.argv) < 2:
        print("Usage: python generate_itinerary.py <trip_id>")
        sys.exit(1)

    trip_id = sys.argv[1]

    # trip_id = '66a8f8e80332585c7062a50b'

    trip_data = get_trip_data_from_db(trip_id)
    if not trip_data:
        print("No trip found with the given ID.")
        sys.exit(1)

    country = trip_data.get('country')
    start_date = trip_data.get('startDate').strftime("%Y-%m-%d")
    end_date = trip_data.get('endDate').strftime("%Y-%m-%d")
    trip_type = trip_data.get('tripType')
    itinerary = trip_data.get('itinerary')


    new_itinerary = generate_itinerary(country, start_date, end_date, trip_type, itinerary)
    save_itinerary_to_db(trip_id, new_itinerary)
    print("Itinerary saved to the database.")

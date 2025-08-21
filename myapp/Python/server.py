from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os
import json
import geopandas as gpd
from shapely.geometry import Point
from contextlib import asynccontextmanager
import logging

# Configure logging for better visibility of startup/shutdown events and errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

india_buffered_territory = None

# Define the absolute path to your shapefile.
# IMPORTANT: Ensure this path is correct on your system where the server runs.
# For deployment, consider using a relative path or bundling the shapefile
# with your application, or serving it from cloud storage/a geospatial database.
shapefile_path = "C:\\Users\\Admin\\Desktop\\voice\\myapp\\Python\\World_12NM_v4_20231025\\World_12NM_v4_20231025\\eez_12nm_v4.shp"

# --- FastAPI Lifespan Event ---
# This asynchronous context manager handles actions that need to happen
# when the FastAPI application starts up and shuts down.
# It's crucial for loading heavy resources like geospatial data only once.
@asynccontextmanager
async def lifespan(app: FastAPI):
    global india_buffered_territory
    logger.info("Application startup: Loading geospatial data...")
    try:
        # Check if the shapefile exists at the specified path
        if not os.path.exists(shapefile_path):
            logger.error(f"Shapefile not found at: {shapefile_path}")
            # Raise a FileNotFoundError if the shapefile is missing, preventing app startup
            raise FileNotFoundError(f"Shapefile '{shapefile_path}' not found. Please ensure it's in the correct location.")

        # Read the world shapefile into a GeoDataFrame
        world = gpd.read_file(shapefile_path)
        
        # Define possible column names where country/territory information might be stored
        possible_cols = ['name', 'TERRITORY1', 'SOVEREIGN1', 'GEONAME', 'COUNTRY']
        india = gpd.GeoDataFrame()

        # Iterate through possible columns to find the GeoDataFrame for "India"
        for col in possible_cols:
            if col in world.columns:
                india = world[(world[col] == "India") | (world[col] == "INDIA")]
                if not india.empty: # If India's territory is found, break the loop
                    break

        # If India's territory is still empty after checking all columns, raise an error
        if india.empty:
            logger.error("India's territory not found in the shapefile. Check column names or data.")
            raise ValueError("India's territory not found in the shapefile.")

        # Convert India's geometry to a projected Coordinate Reference System (CRS) (EPSG:3395 - World Mercator)
        # This is essential for accurate distance calculations (buffering).
        india = india.to_crs(epsg=3395)
        
        # Buffer India's coastline by 12 nautical miles (22224 meters).
        # 1 nautical mile = 1852 meters, so 12 * 1852 = 22224 meters.
        india_buffered_territory = india.buffer(22224)
        logger.info("Geospatial data loaded successfully.")
    except Exception as e:
        logger.exception(f"Failed to load geospatial data during startup: {e}")
        # If loading fails, raise a RuntimeError to prevent the application from starting in a bad state
        raise RuntimeError("Application failed to start due to geospatial data loading error.") from e
    
    yield # This 'yield' statement indicates that the application is now ready to handle requests

    logger.info("Application shutdown: Cleaning up resources (if any).")
    # Any cleanup code (e.g., closing database connections) would go here.

# Initialize FastAPI app with the defined lifespan event handler
app = FastAPI(lifespan=lifespan)

# Configure CORS (Cross-Origin Resource Sharing) middleware.
# This allows your frontend (running on a different origin/port) to communicate with this backend.
# For development, allowing all origins ("*") is common, but in production,
# you should restrict `allow_origins` to your specific frontend domain(s) for security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins
    allow_credentials=True, # Allows cookies to be included in cross-origin requests
    allow_methods=["*"], # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"], # Allows all headers
)

# Dictionary to map Tamil fish names to their English equivalents.
fish_name_dict = {
    "வஞ்சிரம்": "Seer Fish",
    "சங்கரா": "Red Snapper",
    "நெத்திலி": "Anchovy",
    "பராய்": "Barracuda",
    "கொடுவா": "Mullet",
    "சூடா": "Needle Fish",
    "விலங்கு": "Shark",
    "மீன்": "Fish"
}

# Pydantic model for validating incoming fish data from the frontend.
# It expects a native fish name, latitude, and longitude.
class FishData(BaseModel):
    native_name: str
    latitude: float
    longitude: float

# Helper function to convert a native (Tamil) fish name to its English equivalent.
def get_english_fish_name(native_name: str):
    for key in fish_name_dict:
        if key in native_name: # Checks if the native name contains any of the dictionary keys
            return fish_name_dict[key]
    return "Unknown Fish" # Default if no match is found

# Helper function to check if a given latitude and longitude are within India's
# 12 nautical mile marine territory using the pre-loaded geospatial data.
def is_within_india_territory(lat: float, lon: float):
    # Ensure the geospatial data has been loaded during startup
    if india_buffered_territory is None:
        logger.error("Geospatial data not loaded. Cannot perform territory check.")
        # Raise a RuntimeError if data is not initialized, indicating a critical issue
        raise RuntimeError("Geospatial data not initialized.")

    # Create a Shapely Point object from the provided longitude and latitude.
    # It's crucial to specify the initial CRS (EPSG:4326 for lat/lon)
    # and then transform it to the same projected CRS (EPSG:3395) as the buffered territory.
    point = gpd.GeoSeries([Point(lon, lat)], crs='EPSG:4326').to_crs(epsg=3395)
    
    # Perform the spatial check: see if the point falls within the buffered territory.
    return india_buffered_territory.contains(point.iloc[0]).any()

# ------------------- Helper functions for JSON file operations -------------------
def load_json_data(file_path: str) -> dict:
    """
    Loads JSON data from a specified file path.
    Returns an empty dictionary if the file does not exist or if its content
    is empty/malformed JSON, ensuring a valid dictionary is always returned.
    """
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            try:
                data = json.load(f)
                # Ensure the loaded data is a dictionary (for the new grouped format)
                if not isinstance(data, dict):
                    logger.warning(f"Warning: {file_path} content is not a dictionary. Initializing as empty.")
                    return {}
                return data
            except json.JSONDecodeError:
                logger.warning(f"Warning: {file_path} is empty or malformed. Starting new.")
                return {}
    return {} # Return empty dict if file doesn't exist

def save_json_data(file_path: str, data: dict):
    """
    Saves a Python dictionary to a JSON file with pretty-printing (indent=4).
    """
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)

# ------------------- API Endpoint to Handle Fish Data -------------------
# This POST endpoint receives fish data from the frontend.
@app.post("/fish")
def handle_fish(data: FishData):
    native_name = data.native_name.strip()
    latitude = data.latitude
    longitude = data.longitude

    # Validate that the fish native name is not empty
    if not native_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"popup": "Fish name cannot be empty", "status": "error"})

    english_name = get_english_fish_name(native_name)
    timestamp = datetime.now().isoformat()

    try:
        # Check if the reported location is within India's marine boundary
        if not is_within_india_territory(latitude, longitude):
            # If outside, return an alert message to the frontend
            return {
                "popup": "You have crossed India's marine boundary (12 nautical miles). Fishing is not allowed!",
                "status": "alert"
            }
    except RuntimeError as e:
        logger.error(f"Error during territory check: {e}")
        # If there's an issue with the geospatial data (e.g., not loaded), return a server error
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"popup": "Server error during location check.", "status": "error"})

    # Create the data entry for the current fish record
    entry = {
        "latitude": latitude,
        "longitude": longitude,
        "timestamp": timestamp,
        "native_name": native_name,
        "english_name": english_name # Keeping English name within the entry for context
    }

    # --- Save to my_json.json (for session-like data, though currently permanent) ---
    session_file = "my_json.json"
    session_data = load_json_data(session_file) # Load existing data

    # If the English fish name is not yet a key in the dictionary, create an empty list for it
    if english_name not in session_data:
        session_data[english_name] = []
    # Append the new entry to the list associated with the fish's English name
    session_data[english_name].append(entry)
    
    save_json_data(session_file, session_data) # Save the updated dictionary

    # --- Save to total_json.json (for permanent database-like storage) ---
    total_file = "total_json.json"
    total_data = load_json_data(total_file) # Load existing data

    # Same logic as above: create list if fish type is new, then append entry
    if english_name not in total_data:
        total_data[english_name] = []
    total_data[english_name].append(entry)
    
    save_json_data(total_file, total_data) # Save the updated dictionary

    # --- Update tokens.json ---
    # This section manages a simple token counter in a separate JSON file.
    tokens_file = "./token.json" # Relative path to token.json
    tokens_data = load_json_data(tokens_file) # Load existing token data

    # Initialize "tokens" key if it doesn't exist
    if "tokens" not in tokens_data:
        tokens_data["tokens"] = 0

    tokens_data["tokens"] += 30  # Increment tokens by 30 for each successful record
    save_json_data(tokens_file, tokens_data) # Save the updated token count

    # Return a success response to the frontend
    return {
        "popup": f"Fish recorded: {english_name}",
        "status": "success"
    }

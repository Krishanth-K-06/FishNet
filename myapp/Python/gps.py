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
import csv

# Configure logging for better visibility of startup/shutdown events and errors
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables to be initialized during startup
india_buffered_territory = None
fish_name_dict = {}

# Define the absolute path to your shapefile.
shapefile_path = "C:\\Users\\Admin\\Desktop\\voice\\myapp\\Python\\World_12NM_v4_20231025\\World_12NM_v4_20231025\\eez_12nm_v4.shp"

# Define the path to your TSV dataset.
# IMPORTANT: Ensure this path is correct on your system.
tsv_path = "C:\\Users\\Admin\\Desktop\\TamilNadu_OBIS_Data_grouped_by_species.tsv"
@asynccontextmanager
async def lifespan(app: FastAPI):
    global india_buffered_territory
    global fish_name_dict
    
    logger.info("Application startup: Loading geospatial and fish data...")
    try:
        # --- Geospatial Data Loading ---
        if not os.path.exists(shapefile_path):
            logger.error(f"Shapefile not found at: {shapefile_path}")
            raise FileNotFoundError(f"Shapefile '{shapefile_path}' not found. Please ensure it's in the correct location.")

        world = gpd.read_file(shapefile_path)
        possible_cols = ['name', 'TERRITORY1', 'SOVEREIGN1', 'GEONAME', 'COUNTRY']
        india = gpd.GeoDataFrame()
        for col in possible_cols:
            if col in world.columns:
                india = world[(world[col] == "India") | (world[col] == "INDIA")]
                if not india.empty:
                    break
        if india.empty:
            logger.error("India's territory not found in the shapefile.")
            raise ValueError("India's territory not found in the shapefile.")

        india = india.to_crs(epsg=3395)
        india_buffered_territory = india.buffer(22224)
        
        # --- Fish Data Loading from TSV ---
        if not os.path.exists(tsv_path):
            logger.error(f"TSV file not found at: {tsv_path}")
            raise FileNotFoundError(f"TSV file '{tsv_path}' not found. Please ensure it's in the correct location.")
            
        with open(tsv_path, mode='r', encoding='utf-8') as tsvfile:
            reader = csv.DictReader(tsvfile, delimiter='\t')
            for row in reader:
                tamil_name = row.get('vernacular_name_tamil', '').strip()
                english_name = row.get('vernacular_name_english', '').strip()
                if tamil_name and english_name:
                    fish_name_dict[tamil_name] = english_name
                    
        logger.info(f"Geospatial and fish data loaded successfully. Loaded {len(fish_name_dict)} fish names.")
        
    except Exception as e:
        logger.exception(f"Failed to load data during startup: {e}")
        raise RuntimeError("Application failed to start due to data loading error.") from e
    
    yield
    
    logger.info("Application shutdown: Cleaning up resources (if any).")

# Initialize FastAPI app with the defined lifespan event handler
app = FastAPI(lifespan=lifespan)

# Configure CORS middleware.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for validating incoming fish data from the frontend.
class FishData(BaseModel):
    native_name: str
    latitude: float
    longitude: float

# Helper function to convert a native (Tamil) fish name to its English equivalent.
def get_english_fish_name(native_name: str):
    # The fish_name_dict is now populated from the TSV file during startup.
    for key in fish_name_dict:
        if key in native_name:
            return fish_name_dict[key]
    return "Unknown Fish"

# Helper function to check if a given latitude and longitude are within India's
# 12 nautical mile marine territory using the pre-loaded geospatial data.
def is_within_india_territory(lat: float, lon: float):
    if india_buffered_territory is None:
        logger.error("Geospatial data not loaded. Cannot perform territory check.")
        raise RuntimeError("Geospatial data not initialized.")

    point = gpd.GeoSeries([Point(lon, lat)], crs='EPSG:4326').to_crs(epsg=3395)
    return india_buffered_territory.contains(point.iloc[0]).any()

# ------------------- Helper functions for JSON file operations -------------------
def load_json_data(file_path: str) -> dict:
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            try:
                data = json.load(f)
                if not isinstance(data, dict):
                    logger.warning(f"Warning: {file_path} content is not a dictionary. Initializing as empty.")
                    return {}
                return data
            except json.JSONDecodeError:
                logger.warning(f"Warning: {file_path} is empty or malformed. Starting new.")
                return {}
    return {}

def save_json_data(file_path: str, data: dict):
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)

# ------------------- API Endpoint to Handle Fish Data -------------------
@app.post("/fish")
def handle_fish(data: FishData):
    native_name = data.native_name.strip()
    latitude = data.latitude
    longitude = data.longitude

    if not native_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"popup": "Fish name cannot be empty", "status": "error"})

    english_name = get_english_fish_name(native_name)
    timestamp = datetime.now().isoformat()

    try:
        if not is_within_india_territory(latitude, longitude):
            return {
                "popup": "You have crossed India's marine boundary (12 nautical miles). Fishing is not allowed!",
                "status": "alert"
            }
    except RuntimeError as e:
        logger.error(f"Error during territory check: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"popup": "Server error during location check.", "status": "error"})

    entry = {
        "latitude": latitude,
        "longitude": longitude,
        "timestamp": timestamp,
        "native_name": native_name,
        "english_name": english_name
    }

    session_file = "my_json.json"
    session_data = load_json_data(session_file)
    if english_name not in session_data:
        session_data[english_name] = []
    session_data[english_name].append(entry)
    save_json_data(session_file, session_data)

    total_file = "total_json.json"
    total_data = load_json_data(total_file)
    if english_name not in total_data:
        total_data[english_name] = []
    total_data[english_name].append(entry)
    save_json_data(total_file, total_data)

    tokens_file = "./token.json"
    tokens_data = load_json_data(tokens_file)
    if "tokens" not in tokens_data:
        tokens_data["tokens"] = 0
    tokens_data["tokens"] += 30
    save_json_data(tokens_file, tokens_data)

    return {
        "popup": f"Fish recorded: {english_name}",
        "status": "success"
    }
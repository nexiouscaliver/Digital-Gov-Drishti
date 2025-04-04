import logging  # Add import for logging
import os  # Added import
from pymongo import MongoClient  # Ensure this import exists
from pymongo.server_api import ServerApi  # Added import
from gridfs import GridFS
import json  # Added import for json

DB_NAME = "berkeley_offshore"  # Updated database name


def get_mongodb_client():
    """
    Get MongoDB client
    """
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Remove configparser usage and credentials.cfg references

    # Use environment variables for MongoDB credentials
    mongo_username = os.getenv("MONGODB_USERNAME")
    mongo_password = os.getenv("MONGODB_PASSWORD")
    mongo_host = os.getenv("MONGODB_HOST", "localhost")
    mongo_port = os.getenv("MONGODB_PORT", "27017")
    mongo_type = os.getenv("MONGODB_TYPE", "local")

    # Log the config path for debugging
    logging.debug(f"Using MongoDB credentials from environment variables")

    # Set connection strings
    LOCAL_CONNECTION = (
        f"mongodb://{mongo_host}:{mongo_port}"  # ONLY FOR JUPYTER NOTEBOOK!
    )
    # LOCAL_CONNECTION = "mongodb://172.28.205.17:27017"
    ATLAS_CONNECTION = f"mongodb+srv://{mongo_username}:{mongo_password}@regenai-docs.n92ig.mongodb.net/?retryWrites=true&w=majority&appName=RegenAI-Docs"

    # Choose the connection string as needed
    if mongo_type == "atlas":
        connection_string = ATLAS_CONNECTION
    else:
        connection_string = LOCAL_CONNECTION  # Use local connection instead of Atlas

    # Log the connection string being used (mask sensitive parts if using Atlas)
    logging.debug(f"Using MongoDB connection string: {connection_string}")

    try:
        # Create a connection using MongoClient
        client = MongoClient(connection_string, server_api=ServerApi("1"))
        # Attempt a simple command to verify connection
        client.admin.command("ping")
        logging.info("Successfully connected to MongoDB")
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")
        raise e

    return client


def get_collection(collection_name):
    """
    Get a collection from the 'berkeley_offshore' database.
    """
    db = get_mongodb_client()[DB_NAME]
    return db[collection_name]


def get_gridfs_instance():
    """
    Get a GridFS instance tied to the database.
    """
    db = get_mongodb_client()[DB_NAME]
    return GridFS(db)


def upsert_document(collection_name, data):
    collection = get_collection(collection_name)
    collection.replace_one({"_id": data["_id"]}, data, upsert=True)


def insert_document(collection_name, data):
    collection = get_collection(collection_name)
    collection.insert_one(data)


def get_document(collection_name, document_id):
    collection = get_collection(collection_name)
    return collection.find_one({"_id": document_id})


def get_document_json(collection_name, document_id):
    collection = get_collection(collection_name)
    docdata = collection.find_one({"_id": document_id})
    jdata = docdata["extracted_fields"]
    # Parse the JSON string into a dictionary
    processed_dict = json.loads(jdata)
    return processed_dict


def get_latest_document(collection_name, query):
    collection = get_collection(collection_name)
    cursor = collection.find(query).sort("filing_date", -1)
    try:
        return cursor.next()
    except StopIteration:
        print("No document found.")
        return None


def check_document_exists(collection_name, document_id):
    collection = get_collection(collection_name)
    return collection.count_documents({"_id": document_id}, limit=1) > 0


def check_document_exists_by_field(collection_name, field_name, field_value):
    collection = get_collection(collection_name)
    query = {field_name: field_value}
    return collection.count_documents(query, limit=1) > 0


def get_collection_documents(collection_name):
    collection = get_collection(collection_name)
    return collection.find({})

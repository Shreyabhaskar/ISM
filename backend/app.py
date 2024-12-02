from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from pdf_processor import process_pdf
from search_articles import map_syllabus_to_articles
from fetch_youtube_videos import fetch_youtube_videos
from flask_pymongo import PyMongo
import bcrypt
import jwt
from bson.objectid import ObjectId
from datetime import datetime
app = Flask(__name__)
CORS(app)  # Enable CORS
app.config["MONGO_URI"] = "mongodb://localhost:27017/ism"
app.config["SECRET_KEY"] = "secret"  # Replace with a secure key
mongo = PyMongo(app)
# Set up a folder to save the uploaded files temporarily
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed extensions for file upload
ALLOWED_EXTENSIONS = {'pdf'}

def truncate_syllabus_content(data, max_entries=5):
    # Iterate through each subject
    for subject, content in data.items():
        # Access syllabus content for each subject
        syllabus_content = content.get('Syllabus_content', {})
        
        # Iterate through each module in the syllabus content
        for module, topics in syllabus_content.items():
            # Keep only the first 'max_entries' topics in each module
            syllabus_content[module] = topics[:max_entries]
    
    return data

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    
    # Input validation
    fullname = data.get("fullname")
    email = data.get("email")
    password = data.get("password")
    
    if not fullname or not email or not password:
        return jsonify({"error": "All fields are required!"}), 400

    # Check if email already exists
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered!"}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Create the user record
    user_data = {
        "fullname": fullname,
        "email": email,
        "password": hashed_password.decode('utf-8'),
        
    }
    
    # Insert user into the collection
    result = mongo.db.users.insert_one(user_data)
    user_id = str(result.inserted_id)

    # Generate JWT token without expiration
    token = jwt.encode(
        {"uid": user_id},  # No expiration
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )
    user_data_ = {
        "id": str(user_id),
        "fullname": user_data["fullname"],
        "email": user_data["email"]
    }
    
    return jsonify({"message": "Signup successful!", "token": token , "user": user_data_}), 201

@app.route('/signin', methods=['POST'])
def signin():
    data = request.json
    
    # Input validation
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required!"}), 400

    # Find user by email
    user = mongo.db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password!"}), 401

    # Verify password
    if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
        return jsonify({"error": "Invalid email or password!"}), 401

    # Generate JWT token
    token = jwt.encode(
        {"uid": str(user["_id"])},  # No expiration
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )
    user_data = {
        "id": str(user["_id"]),
        "fullname": user["fullname"],
        "email": user["email"]
    }
    
    return jsonify({"message": "Signin successful!", "token": token , "user" : user_data}), 200

@app.route('/verify', methods=['POST'])
def verify_user():
    token = request.headers.get('Authorization')
    
    if not token:
        return jsonify({"error": "Token is missing!"}), 401
    
    try:
        # Decode the token
        decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        user_id = decoded["uid"]
        
        # Find user in the database
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            return jsonify({"error": "Invalid token!"}), 401
        
        # Return user data
        user_data = {
            "id": str(user["_id"]),
            "fullname": user["fullname"],
            "email": user["email"]
        }
        return jsonify({"message": "Token verified successfully!", "user": user_data}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired!"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token!"}), 401

@app.route('/analyze-summary', methods=['POST'])
def analyze_summary():
    """API endpoint to receive a PDF file and extract the syllabus data."""
    # Check if the file is part of the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    youtube_api_key = "AIzaSyCPJ9FMV7P1VusmnhtEOyARPqdV54zUDrE"  # Testing, change to env later
    file = request.files['file']

    # If no file is selected
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # If file is allowed, save it and process it
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Process the uploaded PDF and extract syllabus data
        syllabus_data = process_pdf(file_path)
        truncated_syllabus = truncate_syllabus_content(syllabus_data)
        subject_name = list(truncated_syllabus.keys())[0]  # The first key is the subject name
        syllabus_content = truncated_syllabus.get(subject_name, {}).get('Syllabus_content', {})

        # Fetch YouTube videos and available links
        youtube_data = fetch_youtube_videos(youtube_api_key, syllabus_content, subject_name)
        available_links = map_syllabus_to_articles(syllabus_data)

        # Merge syllabus_data, YouTube data, and available links
        merged_data = syllabus_data
        for module, topics in syllabus_content.items():
            # Ensure module exists in the merged_data
            if module not in merged_data[subject_name]["Syllabus_content"]:
                merged_data[subject_name]["Syllabus_content"][module] = topics

            # Add YouTube videos and links
            merged_data[subject_name]["Syllabus_content"][module] = {
                "Topics": topics,
                "YouTube": youtube_data.get(subject_name, {}).get(module, []),
                "Links": available_links.get(subject_name, {}).get('Syllabus_content', {}).get(module, {})
            }
        user_id = request.form.get("user_id")
        insterData = {
            "user_id": user_id,
            "data": merged_data,
            "created_at": datetime.utcnow()
        }
        result = mongo.db.analyatics.insert_one(insterData)
        doc_id = str(result.inserted_id)
        return jsonify({"id": str(doc_id)}), 200

    else:
        return jsonify({"error": "Invalid file type"}), 400
    
@app.route('/get-summary', methods=['POST'])
def get_summary():
    """API endpoint to fetch data from the 'analyatics' collection using the given ID."""
    # Get the ID from the JSON body of the request
    data = request.get_json()  # Extract JSON data from the request body
    
    if not data or "id" not in data:
        return jsonify({"error": "No ID provided"}), 400

    # Convert the string ID to ObjectId for MongoDB query
    try:
        doc_id = ObjectId(data['id'])  # Ensure the ID is a valid ObjectId
    except Exception as e:
        return jsonify({"error": "Invalid ID format"}), 400

    # Fetch the data from MongoDB
    record = mongo.db.analyatics.find_one({"_id": doc_id})

    if record:
        # Convert MongoDB ObjectId to string for JSON serialization
        record["_id"] = str(record["_id"])
        return jsonify(record), 200
    else:
        return jsonify({"error": "No record found with the given ID"}), 404
    
@app.route('/fetch-analysis/<user_id>', methods=['GET'])
def fetch_analysis(user_id):
    """API endpoint to fetch analysis data filtered by user_id."""
    try:
        # Query the database for documents with the specified user_id
        analysis_data = mongo.db.analyatics.find({"user_id": user_id})

        # Serialize the result to include ObjectId as a string
        serialized_data = []
        for doc in analysis_data:
            doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
            serialized_data.append(doc)

        if not serialized_data:
            return jsonify({"message": "No analysis data found for the provided user ID."}), 404

        return jsonify({"user_id": user_id, "analysis_data": serialized_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ensure the upload folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # Run the Flask app
    app.run(debug=True)
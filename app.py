from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import re
import bcrypt
import json
import certifi
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder to store uploaded images
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size: 16 MB

# Replace the connection string with your MongoDB connection string
from urllib.parse import quote_plus
password = quote_plus("MongoDB*666666")
connection_string = f"mongodb+srv://methunarajan:{password}@cluster0.md27wws.mongodb.net/admin?retryWrites=true&w=majority&ssl=true"
client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
db = client['turf_01']
users_collection = db['user_info']

@app.route('/signup', methods=['POST', 'GET'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already in use"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    users_collection.insert_one({
        "username": username,
        "email": email,
        "password": hashed_password,
        "profileImageUrl": ""  # Initialize with empty string
    })

    return jsonify({"message": "Signup successful"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Please fill out all fields"}), 400

    user = users_collection.find_one({"email": email})
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 400

@app.route('/update-user', methods=['POST'])
def update_user():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')

        if not username or not email:
            return jsonify({"error": "Missing required fields"}), 400

        result = users_collection.update_one(
            {"email": email},  # Filter criteria
            {"$set": {"username": username}}  # Update operation
        )

        if result.modified_count > 0:
            return jsonify({"message": "User updated successfully"}), 200
        else:
            return jsonify({"error": "User not found or no changes applied"}), 404

    except Exception as e:
        app.logger.error(f"Error updating user: {str(e)}")
        return jsonify({"error": "An error occurred while updating the user."}), 500

@app.route('/user-data', methods=['GET', 'POST'])
def get_user_data():
    email = request.args.get('email')
    user = users_collection.find_one({"email": email})
    if user:
        return jsonify({"username": user['username'], "email": user['email'], "profileImageUrl": user.get('profileImageUrl', '')}), 200
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/upload-profile-image', methods=['POST'])
def upload_profile_image():
    try:
        email = request.form.get('email')
        if 'photo' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['photo']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            users_collection.update_one(
                {"email": email},
                {"$set": {"profileImageUrl": file_path}}
            )
            return jsonify({"message": "File uploaded successfully", "profileImageUrl": file_path}), 200

    except Exception as e:
        app.logger.error(f"Error uploading profile image: {str(e)}")
        return jsonify({"error": "An error occurred while uploading the profile image."}), 500

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
import mysql.connector

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this in production!
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app)

# Connect to MySQL Database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="MahmoudSQL123",
    database="flask_react_db"
)
cursor = db.cursor()

@app.route('/')
def home():
    return jsonify({"message": "Flask Backend is Running"})

@app.route('/users', methods=['GET'])
def get_users():
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    return jsonify(users)

@app.route('/add-user', methods=['POST'])
def add_user():
    data = request.json
    cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s)", (data['name'], data['email']))
    db.commit()
    return jsonify({"message": "User added successfully"})

@app.route('/delete-user/<int:id>', methods=['DELETE'])
def delete_user(id):
    cursor.execute("DELETE FROM users WHERE id = %s", (id,))
    db.commit()
    return jsonify({"message": "User deleted successfully"})

@app.route('/update-user/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.json
    cursor.execute("UPDATE users SET name = %s, email = %s WHERE id = %s", (data['name'], data['email'], id))
    db.commit()
    return jsonify({"message": "User updated successfully"})

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", 
                   (data['name'], data['email'], hashed_password))
    db.commit()
    return jsonify({"message": "User registered successfully"})

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    user = cursor.fetchone()
    
    if user and bcrypt.check_password_hash(user[3], data['password']):
        access_token = create_access_token(identity={"id": user[0], "email": user[2]})
        return jsonify({"token": access_token, "user": {"id": user[0], "name": user[1], "email": user[2]}})
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Protected Route (Requires Authentication)
@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    return jsonify({"message": "Welcome to your profile!"})

if __name__ == '__main__':
    app.run(debug=True)
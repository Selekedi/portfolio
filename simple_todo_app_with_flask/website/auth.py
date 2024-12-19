from flask import Blueprint,request,render_template,jsonify
from flask_login import login_user,logout_user
import re
from . models import User
from werkzeug.security import generate_password_hash,check_password_hash
from . import db

auth = Blueprint('auth',__name__)

@auth.route("/sign_in", methods = ["GET","POST"])
def sign_in():
    if request.method == "POST":
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        if not validate_email(email):
            return jsonify({"signnedIn":False})
        user = User.query.filter_by(email = email).first()
        if not user:
            return jsonify({"signnedIn":False})
        if not check_password_hash(user.password,password):
            return jsonify({"siggnedIn":False})
        login_user(user)
        return jsonify({"signnedIn":True})
    return render_template("sign_in.html")


def validate_email(email):
    # Regular expression to validate email format
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if re.match(email_regex, email):
        return True
    return False

@auth.route("/sign_up", methods = ["POST"])
def sign_up():
    if request.method == "POST":
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get("name")
        confirm_password = data.get('confrimPassword')
        if not validate_email(email):
            return jsonify({"signnedUp":False})
        if password != confirm_password:
            return jsonify({"signnedUp":False})
        if len(name) < 1:
            return jsonify({"signnedUp":False})
        hashed_password = generate_password_hash(password)
        new_user = User(email = email,username = name,password = hashed_password)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return jsonify({"signnedUp":True})
        

@auth.route("/log_out")
def log_out():
    logout_user()
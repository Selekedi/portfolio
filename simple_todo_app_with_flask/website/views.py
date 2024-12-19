from flask import Blueprint,render_template,request,jsonify
from flask_login import current_user
from . import db
from .models import Item

views = Blueprint('views',__name__)

@views.route("/")
def home():
    return render_template("index.html")

@views.route("/tasks",methods = ["GET","POST"])
def tasks():
    if request.method == "POST":
        pass
    
    if not current_user.id:
        return jsonify({"items":False})
    items = Item.query.filter_by(user_id = current_user.id)
    return jsonify({"items":items})
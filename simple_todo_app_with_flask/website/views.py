from flask import Blueprint,render_template,request,jsonify
from flask_login import current_user,login_required
from . import db
from .models import Item

views = Blueprint('views',__name__)

@views.route("/")
@login_required
def home():
    return render_template("index.html")

@views.route("/tasks",methods = ["GET","POST"])
def tasks():
    if request.method == "POST":
        pass
    
    if not current_user.id:
        return jsonify({"items":False})
    items = Item.query.filter_by(user_id = current_user.id).all()
    items = [item.as_dict() for item in items]
    return jsonify({"items":items})

@views.route("/task", methods = ["POST","PUT","DELETE"])
def task():
    print(f"recieved request type {request.method}")
    if request.method == "POST":
        data = request.get_json()
        _task = data.get("task")
        new_task = Item(item_message = _task,user_id = current_user.id)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"created":True})
    if request.method == "PUT":
        data = request.get_json()
        _id = data.get("id")
        _task = data.get("task")
        _item = Item.query.filter_by(id = int(_id)).first()
        _item.item_message = _task
        db.session.commit()
        return jsonify({"edited":True})
    if request.method == "DELETE":
        print("went through")
        data = request.get_json()
        _id = data.get("id")
        _item = Item.query.filter_by(id = int(_id)).first()
        db.session.delete(_item)
        db.session.commit()
        return jsonify({"deleted":True})
    
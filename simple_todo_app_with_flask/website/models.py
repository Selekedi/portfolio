from . import db
from flask_login import UserMixin

class User(db.Model,UserMixin):
    id = db.Column(db.Integer,primary_key = True)
    email = db.Column(db.String(150),unique = True,nullable = False)
    password = db.Column(db.String(150),nullable = False)
    username = db.Column(db.String(150),nullable = False)
    items = db.relationship('Item')

class Item(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    item_message = db.Column(db.String(500),nullable = False)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'),nullable = False)
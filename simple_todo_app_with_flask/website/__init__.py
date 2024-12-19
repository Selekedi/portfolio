from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from os import path




db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "BRAD"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    db.init_app(app=app)
    

    from .auth import auth
    from .views import views

    app.register_blueprint(views, url_prefix = "/")
    app.register_blueprint(auth, url_prefix = "/")

    from .models import Item,User

    create_db(app)

    load_manager = LoginManager()
    load_manager.login_view = "auth.login"
    load_manager.init_app(app = app)

    @load_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app

def create_db(app):
    if not path.exists('instance/database.db'):
        with app.app_context():
            db.create_all()
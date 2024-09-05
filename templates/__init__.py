from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hikes.db.sqlite'
    db.init_app(app)

    with app.app_context():
        db.create_all()

    from .routes import init_routes  # Import routes after creating the app to avoid circular imports
    init_routes(app)

    return app



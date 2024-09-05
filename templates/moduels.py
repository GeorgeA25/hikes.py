from . import db



class Hike(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200), nullable=True)
    rating = db.column(db.Float, nullable=True)
    difficulty = db.column(db.stribng(200), nullable=False)

    def __repr__(self):
        return f'<Hike {self.description}>'
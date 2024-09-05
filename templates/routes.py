from flask import render_template, request, jsonify
from .moduels import Hike
from . import db

def create_tables():
    db.create_all()

def init_routes(app):
    def _create_tables():
        db.create_tables()


@app.route('/')
def index():
 return render_template('index.html')

@app.route('/add_hike', methods=['POST'])
def add_hike():
    data = request.json
    new_hike = Hike(
        latitude=data['latitude'],
        longitude=data['longitude'],
        description=data['description'],
        rating=data.get('rating'),
        difficulty=data.get('difficulty')
    )
    db.session.add(new_hike)
    db.session.commit()
    return jsonify({'message': 'Hike added successfully'})

@app.route('/get_hikes', methods=['GET'])
def get_hikes():
    min_rating = request.args.get('rating', type=float, default=1)
    difficulty = request.args.get('difficulty', default=None)
    
    query = Hike.query.filter(Hike.rating >= min_rating)
    
    if difficulty:
        query = query.filter(Hike.difficulty == difficulty)
    
    hikes = query.all()
    hikes_list = [{
        'id': hike.id,  # Include ID for identification in update/delete operations
        'latitude': hike.latitude,
        'longitude': hike.longitude,
        'description': hike.description,
        'rating': hike.rating,
        'difficulty': hike.difficulty
    } for hike in hikes]
    
    return jsonify(hikes_list)

@app.route('/delete_hike', methods=['POST'])
def delete_hike():
    data = request.json
    delete_hike = Hike.query.filter_by(
        latitude=data['latitude'],
        longitude=data['longitude'],
        description=data['description']
    ).first()
    
    if delete_hike:
        db.session.delete(delete_hike)
        db.session.commit()
        return jsonify({'message': 'Hike removed successfully'})
    else:
        return jsonify({'message': 'Hike not found'})

@app.route('/update_hike/<int:hike_id>', methods=['PUT'])
def update_hike(hike_id):
    data = request.json
    hike = Hike.query.get_or_404(hike_id)
    
    hike.latitude = data.get('latitude', hike.latitude)
    hike.longitude = data.get('longitude', hike.longitude)
    hike.description = data.get('description', hike.description)
    hike.rating = data.get('rating', hike.rating)
    hike.difficulty = data.get('difficulty', hike.difficulty)
    
    db.session.commit()
    return jsonify({'message': 'Hike updated successfully'})




 
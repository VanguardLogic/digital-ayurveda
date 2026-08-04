import os
import random
from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# ─── Bootstrap ────────────────────────────────────────────────────────────────

load_dotenv()

app = Flask(__name__,
            static_folder='static',
            template_folder='templates')

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'digital-ayurveda-secret-key')

CORS(app, resources={r"/api/*": {"origins": "*"}})

# ─── Helper Functions ─────────────────────────────────────────────────────────

def _now_iso():
    return datetime.now(timezone.utc).isoformat()

# ─── Main Routes ──────────────────────────────────────────────────────────────

@app.route('/')
def index():
    """Serve the main application HTML page."""
    return render_template('index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check."""
    return jsonify({
        'status': 'success',
        'message': 'Digital Ayurveda API is running flawlessly (Standalone Mode)',
        'timestamp': _now_iso()
    }), 200

# ─── AI Suggestions Route ─────────────────────────────────────────────────────

@app.route('/api/ai-suggestions', methods=['GET'])
def get_ai_suggestions():
    """Get AI-powered wellness suggestions."""
    try:
        period = request.args.get('period', 'evening')
        mood_level = int(request.args.get('mood_level', 5)) * 10

        if mood_level >= 70:
            mood_status = "highly positive & tranquil!"
            mood_message = "Keep up your great practice. A evening ritual will sustain this aura."
        elif mood_level <= 40:
            mood_status = "seeking calm. Time to focus on cooling stress."
            mood_message = "Prioritize deep relaxation, meditation, and rest tonight."
        else:
            mood_status = "balanced and steady."
            mood_message = "Maintain your gentle rhythm throughout the day."

        extra_pool = [
            {'name': 'Chanting a Mantra',       'duration': '5 min',  'icon': '🕉️', 'benefit': 'Spiritual focus'},
            {'name': 'Oil Pulling Ritual',      'duration': '10 min', 'icon': '💧', 'benefit': 'Oral & body cleanse'},
            {'name': 'Soothing Raga Listening', 'duration': '20 min', 'icon': '🎶', 'benefit': 'Calms Vata dosha'},
            {'name': 'Gratitude Journaling',     'duration': '5 min',  'icon': '🏆', 'benefit': 'Resilience & joy'},
            {'name': 'Cold Water Face Splash',   'duration': '2 min',  'icon': '🌊', 'benefit': 'Awakens senses'},
            {'name': 'Sunset Mindful Walk',     'duration': '15 min', 'icon': '🚶', 'benefit': 'Grounds energy'},
        ]
        extras = random.sample(extra_pool, 2)

        suggestions_map = {
            'morning': {
                'title': 'Morning Ritual',
                'icon': '🌅',
                'message': f'Start your day with vital energy. Your aura is {mood_status}',
                'activities': [
                    {'name': 'Surya Namaskar',       'duration': '10 min', 'icon': '🧘',   'benefit': 'Energizes body'},
                    {'name': 'Pranayama Breathwork', 'duration': '5 min',  'icon': '💨',   'benefit': 'Clears mental fog'},
                    {'name': 'Herbal Infusion Tea',   'duration': '5 min',  'icon': '🍵',   'benefit': 'Hydrates & detoxes'},
                    *extras
                ]
            },
            'day': {
                'title': 'Daytime Balance',
                'icon': '☀️',
                'message': f'Sustain harmony through your working hours. Your balance is {mood_status}',
                'activities': [
                    {'name': 'Mindful Eye Rest',       'duration': '5 min',  'icon': '👁️', 'benefit': 'Reduces screen fatigue'},
                    {'name': 'Post-Meal Short Walk',   'duration': '10 min', 'icon': '🚶', 'benefit': 'Aids digestion'},
                    {'name': 'Positive Affirmation',   'duration': '2 min',  'icon': '✨', 'benefit': 'Boosts confidence'},
                    *extras
                ]
            },
            'evening': {
                'title': 'Evening Serenity: Moon Mode',
                'icon': '🌙',
                'message': f'{mood_message} Your current aura is {mood_status}',
                'activities': [
                    {'name': 'Gentle Asana Stretch',   'duration': '15 min', 'icon': '🧘‍♀️', 'benefit': 'Releases tension'},
                    {'name': 'Digital Sunset',         'duration': '60 min', 'icon': '📱', 'benefit': 'Prepares for sleep'},
                    {'name': '4-7-8 Sleep Breath',     'duration': '10 min', 'icon': '😴', 'benefit': 'Deep rest'},
                    *extras
                ]
            }
        }

        return jsonify({
            'status': 'success',
            'period': period,
            'suggestions': suggestions_map.get(period, suggestions_map['evening'])
        }), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

# ─── Error Handlers ───────────────────────────────────────────────────────────

@app.errorhandler(404)
def not_found(error):
    return jsonify({'status': 'error', 'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

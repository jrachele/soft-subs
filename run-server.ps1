# Create a virtual environment
python -m venv .env/

# Activate the virtual environment
.env/Scripts/Activate.ps1

# Install the required packages
pip install -r requirements.txt

# Set the FLASK_APP environment variable
$env:FLASK_APP="server/server.py"

# Run the Flask application
flask run

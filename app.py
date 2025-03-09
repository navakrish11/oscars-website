from flask import Flask, jsonify, request
import pandas as pd

app = Flask(__name__)

# Load Oscar data from Excel file
file_path = r"C:\Users\navak\OneDrive\Documents\Python learning\Oscar web\Oscar database.xlsx"
df = pd.read_excel(file_path, engine="openpyxl")  # Read Excel file

# Ensure column names are correctly recognized
print(df.columns)

# API: Get all Oscar records
@app.route('/api/oscars', methods=['GET'])
def get_oscars():
    return jsonify(df.to_dict(orient='records'))

# API: Search by year
@app.route('/api/oscars/year/<int:year>', methods=['GET'])
def get_by_year(year):
    results = df[df['Year'] == year]
    return jsonify(results.to_dict(orient='records'))

# API: Search by category (case-insensitive)
@app.route('/api/oscars/category', methods=['GET'])
def get_by_category():
    category = request.args.get('name', '')
    results = df[df['Category'].str.contains(category, case=False, na=False)]
    return jsonify(results.to_dict(orient='records'))

# API: Search by winner (case-insensitive)
@app.route('/api/oscars/winner', methods=['GET'])
def get_by_winner():
    winner = request.args.get('name', '')
    results = df[df['Winner'].str.contains(winner, case=False, na=False)]
    return jsonify(results.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)

import os

import pandas as pd
import numpy as np



from flask import Flask, jsonify, render_template
from bson.json_util import dumps
import pymongo


app = Flask(__name__)
conn = 'mongodb://localhost:27017'
client = pymongo.MongoClient(conn)
db = client.QLI
collection = db.GEOJSON
results = db.GEOJSON.find_one()
c={}
c.update({"type":results["type"],"features":results["features"]})
#################################################
# Database Setup
#################################################

@app.route("/")
def index():
	
    """Return the homepage."""
    print("received request from 'home page'")
    return render_template("index.html")


@app.route("/data")
def name():
  
    return jsonify(c)




if __name__ == "__main__":
    app.run(debug=True)

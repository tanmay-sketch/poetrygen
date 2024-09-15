# populate_pivots.py

import json
from sqlalchemy.orm import Session
from database import engine, Poem, Pivot

# Open a session with the database
session = Session(bind=engine)

# Load the pivot data from the JSON file
pivot_data_file = "poems.json"

with open(pivot_data_file) as f:
    pivot_data = json.load(f)

for poem_id, poem_info in pivot_data.items():
    print(f"Processing poem id {poem_id}...")  # Debug print

    poem = session.query(Poem).filter_by(id=poem_id).first()

    if poem:
        print(f"Inserting pivots for poem {poem_id}...")  # Debug print
        for pivot in poem_info["pivots"]:
            pivot_entry = Pivot(
                poem_id=poem_id,
                line_number=pivot["lineNumber"],
                next_poem_id=pivot["nextPoemId"],
                next_line_number=pivot["nextLineStart"]
            )
            session.add(pivot_entry)
    else:
        print(f"Poem with id {poem_id} not found.")  # Debug print

# Commit the transaction and close the session
session.commit()
session.close()

print("Pivot data successfully loaded into the database!")
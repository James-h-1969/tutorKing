# TutorKing!
This will be a website which connects tutors and their students,
allowing them to manage and find tutoring connections.

# How to run the backend
Navigate to `src/tutorking`. Make sure to create a venv and activate it 
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Once this is done, you can start the backend app by running 
```bash
fastapi run main.py
```
This creates the app at 127.0.0.1:8000. Find the docs by going to `http://127.0.0.1:8000/docs`
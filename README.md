# Verseform
Verseform is a web application to generate and tinker with AI-generated poems in higher dimensions.

## Backend Setup (FastAPI)

1. Open the terminal and navigate to the backend folder.
    ```bash
    cd backend
    ```
2. Create a virtual environment:
   ```bash
   python3 -m venv venv
    ```
3. Activate the virtual environment:
    - On Windows:
      ```bash
      venv\Scripts\activate
      ```
    - On macOS/Linux:
      ```bash
      source venv/bin/activate
      ```

4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the FastAPI application:
   ```bash
   uvicorn main:app --reload
   ```

## Frontend Setup (React)

1. Open the terminal and navigate to the frontend folder.
    ```bash
    cd frontend
    ```

2. Install the required packages:
   ```bash
   npm install
   ```

3. Start the React application:
   ```bash
   npm run dev
   ```

Now, the frontend will be available at http://localhost:5173, and the backend at http://localhost:8000.
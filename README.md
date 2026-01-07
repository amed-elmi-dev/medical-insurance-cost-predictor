# Medical Insurance Cost Predictor ✅

**Predicts individual medical insurance cost using a trained regression model (Random Forest).**

---

## Project overview 🔬

This repository contains a small end-to-end project that trains and serves a model to predict medical insurance costs based on features like age, BMI, number of children, sex, region, and smoking status.

- **Backend:** FastAPI application exposing a `/predict` endpoint (in `backend/`).
- **Frontend:** React + Vite single-page app that collects user input and displays predictions (in `frontend/insurance-predictor/`).
- **Models:** Pretrained model artifacts (in `models/`): `random_forest.pkl`, `scaler.pkl`, and `columns.json`.
- **Data:** Original dataset `data/insurance.csv` and an analysis/training notebook at `notebook/Insurance_cost_prediction.ipynb`.
- **Results:** Model performance metrics in `results/model_performance.csv`.

---

## Quick start ⚡

Requirements:

- Python 3.9+ (or 3.8+)
- Node.js & npm (for frontend)

Backend (API)

1. Create and activate a Python virtual environment:

   Windows (PowerShell):

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

2. Install required Python packages:

```bash
pip install fastapi uvicorn scikit-learn joblib numpy pandas
```

3. Run the API (from project root):

```bash
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000. The root route returns a simple health message.

Frontend (React + Vite)

1. Navigate to the frontend folder:

```bash
cd frontend/insurance-predictor
```

2. Install dependencies and start dev server:

```bash
npm install
npm run dev
```

3. Open the URL shown by Vite (usually http://localhost:5173) to use the UI.

---

## API usage 🔧

Endpoint: `POST /predict`

- Content-Type: `application/json`
- Expected JSON body:

```json
{
  "age": 40,
  "sex": "male",
  "bmi": 28.5,
  "children": 2,
  "smoker": "no",
  "region": "northwest"
}
```

Response:

```json
{ "prediction": 12345.67 }
```

Example curl request:

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"age": 40, "sex":"male", "bmi": 28.5, "children":2, "smoker":"no", "region":"northwest"}'
```

Notes:

- The backend `predict_pipeline.py` expects the fields above and performs scaling + one-hot encoding to arrange features in the same column order used in training.
- The model predicts log(charges) internally and the API returns the exponentiated value (actual estimated cost in dollars).

---

## Model & Training 📈

- Trained models and scalers are in `models/`.
- `columns.json` documents the exact feature order used by the model: `age`, `bmi`, `children`, `sex_male`, `smoker_yes`, and region dummies.
- A training and evaluation notebook is available at `notebook/Insurance_cost_prediction.ipynb`.
- Sample performance metrics (see `results/model_performance.csv`):

| Model             |   MAE |  RMSE |    R² |
| ----------------- | ----: | ----: | ----: |
| Random Forest     | ~2284 | ~4787 | 0.856 |
| Gradient Boosting | ~2394 | ~4979 | 0.844 |
| Linear Regression | ~4114 | ~7939 | 0.604 |

---

## Project structure 📁

```
backend/                     # FastAPI service
  app.py
  predict_pipeline.py        # preprocessing + model inference
data/                        # raw dataset (insurance.csv)
frontend/insurance-predictor/ # React + Vite frontend
models/                      # saved models & scaler & columns
notebook/                    # training & EDA notebook
results/                     # evaluation metrics and plots
```

---

## Development & Contribution 🤝

- To retrain, use the notebook or create a training script that: cleans the `data/insurance.csv`, fits a model, saves `scaler.pkl`, `random_forest.pkl` (or other), and updates `models/columns.json`.
- Open a PR with a clear description for feature additions or bug fixes.

---

## Notes & TODOs 📝

- Add a `requirements.txt` or `pyproject.toml` for reproducible backend installs.
- Add tests for API endpoints and frontend.
- Optionally containerize the app with Docker for easier deployment.

---

## License & Contact

Add your preferred license and maintainer contact here. If you want, I can add an MIT/Apache license section and a sample badge.

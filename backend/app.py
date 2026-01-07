from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .predict_pipeline import predict_cost

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Medical Cost Prediction API"}

@app.post("/predict")
def predict(data: dict):
    """
    Receives JSON from React and returns predicted insurance cost.
    """
    prediction = predict_cost(data)
    return {"prediction": prediction}  # matches React's expected key


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, ConfigDict
from sklearn.linear_model import LinearRegression
from typing import List
import math

app = FastAPI(
    title="Ration Demand Forecasting API",
    description="Forecast ration demand from monthly history",
    version="1.0.0"
)


class ForecastRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    item_name: str = Field(min_length=1, alias="itemName")
    unit: str = Field(default="KG", min_length=1)
    monthly_demand: List[float] = Field(
        min_length=3, alias="monthlyDemand"
    )


class ForecastResponse(BaseModel):
    item_name: str = Field(serialization_alias="item_name")
    unit: str
    predicted_demand: float = Field(
        serialization_alias="predicted_demand"
    )
    method: str
    note: str


@app.get("/")
def home():
    return {"message": "Ration AI Forecasting API is running"}


@app.post("/api/ai/forecast", response_model=ForecastResponse)
def forecast_demand(request: ForecastRequest):
    values = request.monthly_demand

    if any(not math.isfinite(v) or v < 0 for v in values):
        raise HTTPException(
            status_code=400,
            detail="Demand values must be finite and non-negative"
        )

    months = [[i + 1] for i in range(len(values))]
    next_month = [[len(values) + 1]]

    model = LinearRegression()
    model.fit(months, values)

    prediction = float(model.predict(next_month)[0])
    prediction = max(0.0, prediction)

    return ForecastResponse(
        item_name=request.item_name,
        unit=request.unit,
        predicted_demand=round(prediction, 2),
        method="Linear Regression",
        note=(
            "Experimental estimate based on supplied monthly history; "
            "actual demand may differ."
        )
    )

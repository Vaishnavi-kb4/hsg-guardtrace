"""
FastAPI Microservice for H2S Guard Trace

Connects OpenCV image processing, scikit-learn calibration regression,
and PostgreSQL database storage into high-performance REST API endpoints.
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any

from image_processor import decode_base64_image, extract_wristband_features
from calibration_engine import calibrator
from database import init_postgres_db, save_measurement_to_postgres

app = FastAPI(
    title="H2S Guard FastAPI Microservice",
    description="FastAPI + OpenCV + scikit-learn + PostgreSQL H2S Dosimetry Calibration API",
    version="1.0.0"
)

# Enable CORS for React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_postgres_db()

class AnalyzeRequest(BaseModel):
    preShiftImage: str
    postShiftImage: str
    badgeId: str
    batchId: str
    workerId: Optional[str] = "W-108"
    shift: Optional[str] = "Morning Shift"
    durationHours: Optional[float] = 8.0

@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "framework": "FastAPI 0.100+",
        "image_engine": "OpenCV 4.8+ (Contour Detection & Color Spaces)",
        "calibration_engine": "scikit-learn Polynomial Ridge Regression",
        "database": "PostgreSQL Driver Active",
    }

@app.post("/api/analyze")
def analyze_h2s_dosimeter(payload: AnalyzeRequest):
    try:
        # 1. OpenCV Feature Extraction
        img_pre = decode_base64_image(payload.preShiftImage)
        img_post = decode_base64_image(payload.postShiftImage)
        
        feat_pre = extract_wristband_features(img_pre)
        feat_post = extract_wristband_features(img_post)
        
        if not feat_pre["quality"]["is_pass"]:
            raise HTTPException(status_code=400, detail=f"Pre-shift image error: {feat_pre['quality']['failure_reason']}")
            
        if not feat_post["quality"]["is_pass"]:
            raise HTTPException(status_code=400, detail=f"Post-shift image error: {feat_post['quality']['failure_reason']}")
            
        # 2. scikit-learn Calibration & Exposure Calculation
        exposure_res = calibrator.predict_exposure(
            pre_rgb=feat_pre["rgb"],
            post_rgb=feat_post["rgb"],
            duration_hours=payload.durationHours or 8.0
        )
        
        meas_id = f"MEAS-{os.urandom(2).hex().upper()}"
        timestamp_str = "Just analyzed via FastAPI + OpenCV"
        
        meas_record = {
            "id": meas_id,
            "worker_id": payload.workerId,
            "badge_id": payload.badgeId,
            "batch_id": payload.batchId,
            "shift": payload.shift,
            "timestamp": timestamp_str,
            "exposure": exposure_res["cumulative_exposure_ppm_h"],
            "twa_ppm": exposure_res["twa_ppm"],
            "status": exposure_res["status"],
        }
        
        # 3. PostgreSQL Database Persistence
        db_saved = save_measurement_to_postgres(meas_record)
        
        return {
            "success": True,
            "measurementId": meas_id,
            "badgeId": payload.badgeId,
            "batchId": payload.batchId,
            "workerId": payload.workerId,
            "preShift": feat_pre,
            "postShift": feat_post,
            "exposure": exposure_res,
            "postgresSaved": db_saved,
            "engine": "FastAPI + OpenCV + scikit-learn + PostgreSQL",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

"""
PostgreSQL Database Driver & Persistence Module for H2S Guard Microservice

Handles connection pooling and saving officers, workers, badges, shifts,
measurements, and exposure history to PostgreSQL.
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any, List, Optional

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
)

def get_db_connection():
    """Gets a raw psycopg2 PostgreSQL connection."""
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        # Graceful fallback if database connection fails
        return None

def init_postgres_db():
    """Initializes PostgreSQL schema tables for users, workers, badges, measurements."""
    conn = get_db_connection()
    if not conn:
        print("[PostgreSQL] Info: PostgreSQL not connected directly. Fallback mode active.")
        return False
        
    try:
        with conn.cursor() as cur:
            cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'worker',
                shift TEXT,
                badge_id TEXT UNIQUE,
                batch_id TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            CREATE TABLE IF NOT EXISTS measurements (
                id TEXT PRIMARY KEY,
                worker_id TEXT NOT NULL,
                badge_id TEXT NOT NULL,
                batch_id TEXT NOT NULL,
                shift TEXT,
                timestamp TEXT NOT NULL,
                exposure REAL NOT NULL,
                twa_ppm REAL NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            """)
            conn.commit()
            print("[PostgreSQL] Database tables initialized successfully!")
            return True
    except Exception as err:
        print(f"[PostgreSQL] Init Error: {err}")
        return False
    finally:
        conn.close()

def save_measurement_to_postgres(measurement: Dict[str, Any]) -> bool:
    """Saves a new H2S measurement record to PostgreSQL database."""
    conn = get_db_connection()
    if not conn:
        return False
    try:
        with conn.cursor() as cur:
            cur.execute("""
            INSERT INTO measurements (id, worker_id, badge_id, batch_id, shift, timestamp, exposure, twa_ppm, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET exposure = EXCLUDED.exposure, status = EXCLUDED.status;
            """, (
                measurement.get("id"),
                measurement.get("worker_id"),
                measurement.get("badge_id"),
                measurement.get("batch_id"),
                measurement.get("shift"),
                measurement.get("timestamp"),
                measurement.get("exposure"),
                measurement.get("twa_ppm"),
                measurement.get("status"),
            ))
            conn.commit()
            return True
    except Exception as err:
        print(f"[PostgreSQL] Save Measurement Error: {err}")
        return False
    finally:
        conn.close()

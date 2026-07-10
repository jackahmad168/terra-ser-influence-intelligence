# Terra-ser Influence Intelligence™

## Setup Instructions

### 1. Backend (Node.js)
```bash
cd backend
npm install
node server.js
```

## Overview

This repository contains a full-stack influencer intelligence project with:
- `backend/` — Node.js API using Express and PostgreSQL
- `frontend/` — React dashboard created with Create React App
- `ai/` — Python machine learning prediction scripts
- `database/` — PostgreSQL schema and seed data
- `docs/` — Project documentation

## Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the React app:
   ```bash
   npm start
   ```
3. Visit `http://localhost:3000`

## AI Setup

Install Python dependencies globally or in a virtual environment:
```bash
python -m pip install pandas scikit-learn
```
Run the prediction script:
```bash
python ai/prediction.py
```

## Database Setup

Create the PostgreSQL database and load the schema:
```sql
CREATE DATABASE terra_ser;
\c terra_ser
\i database/schema.sql
```

## Notes

- The backend expects PostgreSQL to be available on `localhost:5432`.
- If your PostgreSQL user/password differ, update `backend/models/db.js`.
- The frontend fetches data from `http://localhost:5000/api/influencers`.

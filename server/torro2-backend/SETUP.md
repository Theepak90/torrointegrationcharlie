# Backend Setup Guide

## Quick Start

```bash
cd server/torro2-backend
./start.sh
```

Or manually:
```bash
cd server/torro2-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## What's Included

✅ **61 API endpoints** total:
- 16 Lineage endpoints (`/api/lineage/*`)
- 5 Marketplace endpoints (`/api/bigquery/*`, `/api/starburst/*`)
- 2 Assets endpoints (`/api/assets`)
- Connectors, activities, dashboard, system health, etc.

## API Docs

Once server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Data Storage

All data persists in JSON files (auto-created on first run):
- `connectors.json` - Active connections
- `assets.json` - Discovered assets
- `lineage_store.json` - Lineage graph
- `published_tags.json` - Published tags history

## Requirements

- Python 3.10+ (tested on 3.11)
- pip, venv
- See `requirements.txt` for dependencies

## Troubleshooting

**"Module not found" errors:**
```bash
pip install -r requirements.txt
```

**"Port 8000 already in use":**
```bash
# Change port in uvicorn command:
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
# Then update frontend API URLs to port 8001
```

**Large JSON files on first clone:**
```bash
# Fresh reset:
echo '[]' > connectors.json
echo '[]' > assets.json
echo '{"nodes": [], "edges": []}' > lineage_store.json
echo '{}' > published_tags.json
```


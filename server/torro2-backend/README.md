# Torro Backend

Full-featured FastAPI backend for the Data Nexus platform.

## Features
- **BigQuery**: Connect, discover assets, publish tags
- **Starburst Galaxy**: Connect, discover assets, publish tags, governance control
- **Azure Purview**: Connect, discover assets (optional)
- **Data Lineage**: Build and visualize data lineage graphs
- **Assets Management**: Track discovered assets across all connectors

## Quick Start

### Option 1: Using start script (recommended)
```bash
./start.sh
```

### Option 2: Manual setup
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

Server runs on `http://localhost:8000`

- API Docs: `http://localhost:8000/docs`
- Health Check: `GET /api/health`

### Connectors
- `GET /api/connectors` - List all connectors
- `POST /api/connectors/bigquery/test-stream` - Test BigQuery connection
- `POST /api/connectors/starburst/test-stream` - Test Starburst connection
- `POST /api/azure/test-connection` - Test Azure Purview connection
- `DELETE /api/connectors/{connector_id}` - Delete connector

### Assets
- `GET /api/assets` - List discovered assets (supports pagination, search, filters)
- `GET /api/assets/{asset_id}` - Get asset details

### Data Lineage
- `GET /api/lineage` - Get lineage graph
- `GET /api/lineage/{asset_id}` - Get lineage for specific asset

### Publishing
- `POST /api/bigquery/table-details` - Get BigQuery table schema
- `POST /api/bigquery/publish-tags` - Publish tags to BigQuery
- `POST /api/starburst/table-details` - Get Starburst table schema
- `POST /api/starburst/publish-tags` - Publish tags to Starburst
- `GET /api/starburst/governance-control` - Get governance/RBAC data

## Data Storage

All data is stored locally in JSON files (created automatically on first run):
- `connectors.json` - Active connections
- `assets.json` - Discovered assets inventory
- `lineage_store.json` - Lineage graph data
- `published_tags.json` - Published tags history
- `azure_config.json` - Azure Purview configuration

## Environment Variables

Optional: Create a `.env` file for credentials if using `connectors.template.json`

## Notes

- First run creates empty JSON files for a fresh start
- Backend auto-discovers assets when you test/connect to data sources
- All data persists locally; delete JSON files to reset


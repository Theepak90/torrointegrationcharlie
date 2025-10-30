# Torro Integrated Platform

Complete data governance platform with integrated frontend and backend.

## Repository Structure

```
.
├── server/                      # Main frontend application
│   ├── src/
│   │   ├── torro2/pages/       # Data Nexus pages (integrated)
│   │   │   ├── ConnectorsPage.jsx
│   │   │   ├── AssetsPage.jsx
│   │   │   ├── DataLineagePage.jsx
│   │   │   ├── MarketplacePage.jsx
│   │   │   └── TrinoGovernanceControlPage.jsx
│   │   └── ...
│   └── torro2-backend/         # Full backend API
│       ├── api/                # API modules
│       ├── main.py             # FastAPI app
│       ├── start.sh            # Start script
│       └── requirements.txt
└── torro2/                     # Standalone torro2 app
    ├── frontend/               # Vite React app
    └── backend/                # FastAPI backend
```

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/Theepak90/torrointegrationcharlie.git
cd torrointegrationcharlie
```

### 2. Start Backend
```bash
cd server/torro2-backend
./start.sh
```
Or manually:
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Start Frontend
```bash
cd server
npm install
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Features

### Data Nexus (in Left Menu)
- **Connectors**: Connect to BigQuery, Starburst Galaxy, Azure Purview
- **Discovered Assets**: View all discovered data assets
- **Data Lineage**: Visualize data flow and dependencies
- **Publish to Marketplace**: Tag and publish data assets
- **Trino Governance Control**: Manage Starburst access control

### Requirements
- Node.js 18+
- Python 3.10+
- BigQuery/Starburst/Azure credentials (for connectors)

### Important Notes
- Backend starts fresh with empty JSON files
- **Lineage requires discovered assets** - connect to data sources first
- **Marketplace needs real credentials** for BigQuery/Starburst
- All data persists locally in JSON files

## For Fresh Users

1. Backend creates fresh empty JSON files automatically
2. Connect to data sources via Connectors page
3. Assets auto-discover when you test connections
4. Lineage builds from discovered assets
5. Marketplace publishes tags to actual data sources

## Standalone torro2

Also available in `torro2/` folder as separate frontend+backend application.


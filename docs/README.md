# \# Brazilian Heritage Risk Management Map

# 

# Interactive web-based mapping system for analyzing cultural heritage sites in Brazil and their associated risks from natural disasters, technological hazards, and other threats.

# 

# \## 🚀 Quick Start

# 

# \### Requirements

# \- Modern web browser (Chrome, Firefox, Safari, Edge)

# \- Python 3.x (for local development)

# \- Git (for version control)

# 

# \### Running Locally

# 1\. Download the project files

# 2\. Open terminal/command prompt in project folder

# 3\. Start a local server:

# ```bash

# python -m http.server 8000 --bind 127.0.0.1

# ```

# 4\. Open browser to: `http://127.0.0.1:8000`

# 

# \## 📁 Project Structure

# 

# ```

# brazil-heritage-map-dev/

# ├── index.html                # Main map interface (12 KB)

# ├── main.js                   # Core mapping logic and filtering (53 KB)  

# ├── styles.css                # Interface styling (15 KB)

# ├── data\_info.json            # Data source timestamps (1 KB)

# ├── documents.json            # Document availability tracker (1 KB)

# ├── icm\_data.js               # Municipal capacity classification (152 KB)

# ├── icm\_combined.csv          # ICM source data (104 KB)

# ├── conversion.py             # Python data processing script (6 KB)

# ├── .nojekyll                 # GitHub Pages configuration

# ├── NotaMetodologica.md       # Methodology documentation (5 KB)

# ├── README.md                 # Project documentation (1 KB)

# ├── docs/                     # Document management folders

# │   ├── protocols/            # State-level risk management protocols (PDFs)

# │   └── risk-management-plans/ # Site-specific risk management plans (PDFs)

# ├── data/                     # GeoJSON data files (4 files)

# │   ├── heritage\_sites.js     # Heritage sites with risk data

# │   ├── municipal\_risk.js     # Municipal choropleth data  

# │   ├── dam\_buffers.js        # Dam risk buffer zones

# │   └── municipal\_boundaries.js # Administrative boundaries

# ├── js/                       # Leaflet libraries (do not modify)

# ├── css/                      # Additional styling

# ├── legend/                   # Map legend assets  

# └── webfonts/                 # Font files

# ```

# 

# \## 🎯 Core Features

# 

# \### Risk Assessment System

# The map calculates enhanced heritage risk using the formula:

# ```

# Enhanced Risk = (Base Risk × 0.6) + (ICM Factor × 0.25) + (PDF Factor × 0.15)

# ```

# 

# \*\*Components:\*\*

# \- \*\*Base Risk\*\*: Combined fire, geological, hydrological, and dam risks multiplied by number of heritage sites

# \- \*\*ICM Factor\*\*: Municipal institutional capacity (A=0, B=1, C=2, D=3)

# \- \*\*PDF Factor\*\*: Document availability (0=both available, 0.5=one available, 1=none available)

# 

# \### Layer System

# \- \*\*Heritage Sites\*\*: Cultural sites with risk classifications and filtering

# \- \*\*Municipal Risk\*\*: Choropleth showing municipality-level risk

# \- \*\*Dam Buffers\*\*: Potentially dangerous dam impact zones

# \- \*\*Municipal Boundaries\*\*: Administrative boundaries (optional)

# 

# \### Risk Categories

# The system uses 3 risk type filters:

# \- \*\*Desastre Tecnológico\*\*: Sites with dominant SNISB dam risk

# \- \*\*Incêndio Florestal\*\*: Sites with dominant INPE fire risk (ready for future data)

# \- \*\*Geo/Hidro CEMADEN\*\*: Sites with dominant CEMADEN geological/hydrological risk (combined category)

# 

# \## 📋 GitHub Management for Beginners

# 

# \### Recommended Tool: GitHub Desktop

# 

# 1\. \*\*Download GitHub Desktop\*\*

# &nbsp;  - Visit: https://desktop.github.com/

# &nbsp;  - Install the application

# 

# 2\. \*\*Clone Repository\*\*

# &nbsp;  - Open GitHub Desktop

# &nbsp;  - File → Clone Repository

# &nbsp;  - Enter: `https://github.com/lbreduardo/brazil-heritage-map-dev`

# &nbsp;  - Choose local folder

# 

# 3\. \*\*Making Changes\*\*

# &nbsp;  - Edit files in your local folder

# &nbsp;  - GitHub Desktop will show changes automatically

# &nbsp;  - Add summary description of changes

# &nbsp;  - Click "Commit to main"

# 

# 4\. \*\*Publishing Updates\*\*

# &nbsp;  - Click "Push origin" to upload changes

# &nbsp;  - Changes will appear on GitHub Pages within 5-10 minutes

# 

# \### Alternative: Command Line

# ```bash

# \# Clone repository

# git clone https://github.com/lbreduardo/brazil-heritage-map-dev

# cd brazil-heritage-map-dev

# 

# \# Make changes, then:

# git add .

# git commit -m "Description of changes"

# git push origin main

# ```

# 

# \## 📄 Document Management System

# 

# \### Adding Risk Management Documents

# 

# The system tracks two types of documents:

# 

# \#### 1. State-Level Protocols

# \- \*\*Location\*\*: `/docs/protocols/`

# \- \*\*Naming\*\*: Use state abbreviation (e.g., `SP\_protocol.pdf`, `RJ\_protocol.pdf`)

# \- \*\*Purpose\*\*: General heritage risk management procedures by state

# 

# \#### 2. Site-Specific Risk Plans

# \- \*\*Location\*\*: `/docs/risk-management-plans/`

# \- \*\*Naming\*\*: Use heritage site identifier (e.g., `IPHAN\_001\_risk\_plan.pdf`)

# \- \*\*Purpose\*\*: Detailed risk management for individual heritage sites

# 

# \### Updating Document Availability

# 

# After adding PDFs, update `/documents.json`:

# 

# ```json

# {

# &nbsp; "protocols": \[

# &nbsp;   "sp\_protocol",

# &nbsp;   "rj\_protocol",

# &nbsp;   "mg\_protocol"

# &nbsp; ],

# &nbsp; "risk\_management\_plans": \[

# &nbsp;   "iphan\_001",

# &nbsp;   "iphan\_003",

# &nbsp;   "iphan\_005"

# &nbsp; ]

# }

# ```

# 

# \*\*PDF Factor Calculation:\*\*

# \- Both available = 0 (lowest risk increase)

# \- One available = 0.5 (moderate risk increase)  

# \- None available = 1 (highest risk increase)

# 

# \## ⚠️ Important Assumptions \& Limitations

# 

# \### Risk Data Assumptions

# 1\. \*\*Fire Risk Data\*\*: INPE fire risk data shows minimal values for most heritage sites. The fire risk filter is implemented and ready for future data updates.

# 

# 3\. \*\*CEMADEN Data\*\*: Geological and hydrological risks are provided as combined scores and mapped to a single "Geo/Hidro CEMADEN" filter category. The system cannot separate these into distinct geological vs. hydrological categories as they come pre-combined from the data source.

# 

# 3\. \*\*PDF Factors\*\*: For municipal-level risk calculations, an average PDF factor of 0.5 is assumed when specific document availability data is unavailable.

# 

# 4\. \*\*ICM Classifications\*\*: Municipalities without ICM data default to a factor of 1.5 in risk calculations.

# 

# \### Data Processing Notes

# \- Heritage sites with all risk scores ≤ 0.1 are classified in the "geo\_hydro" category for filtering purposes

# \- Municipal boundaries are optimized to show only municipalities containing heritage sites for performance reasons

# \- Risk type filtering uses the dominant risk source for each heritage site

# \- Low-risk sites default to the combined geological/hydrological category

# 

# \## 🔧 Customization

# 

# \### Updating Risk Thresholds

# Modify color breaks in `style\_municipalities\_with\_combined\_risk\_simplified\_2\_0()` function in main.js

# 

# \### Adding New Risk Categories

# 1\. Update `filters.riskType` object in main.js

# 2\. Add corresponding HTML checkboxes in index.html

# 3\. Modify `getDominantRiskType()` function logic

# 

# \### Styling Changes

# Edit `styles/map\_styles.css` for interface appearance modifications

# 

# \## 🌐 Data Sources

# 

# \- \*\*Heritage Sites\*\*: IPHAN (Brazilian National Historic and Artistic Heritage Institute)

# \- \*\*Dam Risk\*\*: SNISB (National Dam Safety Information System)

# \- \*\*Fire Risk\*\*: INPE (National Institute for Space Research)

# \- \*\*Geological/Hydrological Risk\*\*: CEMADEN (National Center for Monitoring and Alerts of Natural Disasters)

# \- \*\*Municipal Capacity\*\*: ICM (Municipal Capacity Index)

# 

# \*Data timestamps are displayed in the map interface and updated automatically from data\_info.json\*

# 

# \## 🎨 Interface Usage

# 

# \### Filter Panel

# \- \*\*🏛 Bem Cultural Material\*\*: Filter by heritage asset type

# \- \*\*🔥 Riscos\*\*: Filter by dominant risk type

# \- \*\*🗺 Camadas do Mapa\*\*: Toggle map layer visibility

# \- \*\*Resetar Todos os Filtros\*\*: Clear all filters and layers

# 

# \### Map Interactions

# \- Click heritage sites for detailed risk information

# \- Click municipalities for summary statistics and ICM classification

# \- Use layer toggles to show/hide different data types

# \- Reset button clears all selections while preserving filter options

# 

# \## 📱 Browser Support

# 

# Optimized for modern browsers with full JavaScript support:

# \- Chrome 80+

# \- Firefox 75+

# \- Safari 13+

# \- Edge 80+

# 

# \## 🤝 Contributing

# 

# When making updates:

# 1\. Test changes locally using Python server

# 2\. Commit with descriptive messages

# 3\. Verify GitHub Pages deployment

# 4\. Update documentation for significant changes

# 

# For questions about the risk calculation methodology or data integration, refer to the enhanced risk formula documentation above.


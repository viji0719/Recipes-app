# 🍽️ Recipe Explorer

A full-stack web application for browsing and searching 8,451 US recipes with a premium magazine-style UI.

![Recipe Explorer](screenshots/layout.png)

---

## ✨ Features

- **Masonry tile grid** with dynamic food images, cuisine badges, and star ratings
- **Smart search & filters** — search by title, cuisine, rating, cook time, and calories
- **Detail drawer** — click any recipe to see full description, cook times, and nutrition facts
- **Pagination** — customizable results per page (15 to 50)
- **NaN handling** — invalid data stored as NULL in the database
- **Loading skeletons** and empty state fallbacks for smooth UX

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite (auto-created on first run) |
| Frontend | React 18, Vite |
| Styling | Inline React styles with CSS animations |
| Fonts | Cormorant Garamond, Jost (Google Fonts) |

---

## 📁 Project Structure

```
recipes-app/
├── backend/
│   ├── main.py          # FastAPI app — API endpoints
│   ├── database.py      # SQLAlchemy models & data import
│   ├── schema.sql       # SQL schema reference
│   ├── recipes.json     # Source dataset (8,451 recipes)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx                      # Main app — grid layout & state
│   │   ├── components/
│   │   │   ├── RecipeCard.jsx           # Tile card with image
│   │   │   ├── RecipeDrawer.jsx         # Slide-in detail panel
│   │   │   ├── FilterBar.jsx            # Search filter inputs
│   │   │   ├── Pagination.jsx           # Page controls
│   │   │   └── StarRating.jsx           # Star rating display
│   │   └── utils/
│   │       ├── api.js                   # API fetch functions
│   │       └── imageMap.js              # Food image & gradient mapping
│   ├── index.html
│   ├── package.json
│   └── vite.config.js   # Proxy to backend
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

On first run, all 8,451 recipes are automatically imported into SQLite.  
API runs at → **http://localhost:8000**  
Swagger docs → **http://localhost:8000/docs**

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

App runs at → **http://localhost:5173**

---

## 📡 API Reference

### `GET /api/recipes`
Returns all recipes paginated and sorted by rating descending.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `limit` | int | 10 | Results per page (max 100) |

**Example:**
```
GET /api/recipes?page=1&limit=15
```

---

### `GET /api/recipes/search`
Search and filter recipes.

| Parameter | Type | Description |
|-----------|------|-------------|
| `title` | string | Partial match on title |
| `cuisine` | string | Partial match on cuisine |
| `rating` | string | e.g. `>=4.5`, `<=5`, `=5` |
| `total_time` | string | e.g. `<=30`, `>60` |
| `calories` | string | e.g. `<=500`, `>=200` |
| `page` | int | Page number |
| `limit` | int | Results per page |

**Supported operators:** `>=` `<=` `>` `<` `=`

**Examples:**
```
GET /api/recipes/search?title=pie&rating=>=4.5
GET /api/recipes/search?cuisine=Southern&calories=<=400&total_time=<=60
```

---

### `GET /api/recipes/{id}`
Get a single recipe by ID.

---

## 🗄️ Database Schema

```sql
CREATE TABLE recipes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    cuisine     VARCHAR(255),
    title       VARCHAR(255),
    rating      FLOAT,      -- NULL if NaN in source data
    prep_time   INTEGER,    -- NULL if NaN in source data
    cook_time   INTEGER,    -- NULL if NaN in source data
    total_time  INTEGER,    -- NULL if NaN in source data
    description TEXT,
    nutrients   JSON,
    serves      VARCHAR(100)
);
```

---

## 📄 License

This project was built as part of a technical assessment.  
Recipe data sourced from [Allrecipes.com](https://www.allrecipes.com).

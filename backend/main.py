"""
main.py - FastAPI application for Recipe API
"""
import re
import json
from typing import Optional, Any
from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, cast, String

from database import Recipe, get_db, init_db

app = FastAPI(title="Recipes API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    init_db()


def recipe_to_dict(recipe: Recipe) -> dict:
    return {
        "id": recipe.id,
        "title": recipe.title,
        "cuisine": recipe.cuisine,
        "rating": recipe.rating,
        "prep_time": recipe.prep_time,
        "cook_time": recipe.cook_time,
        "total_time": recipe.total_time,
        "description": recipe.description,
        "nutrients": recipe.nutrients,
        "serves": recipe.serves,
    }


def parse_filter(value: str):
    """Parse filter strings like '<=400', '>=4.5', '=100', or plain number"""
    if value is None:
        return None, None
    match = re.match(r'^(<=|>=|<|>|=)?(-?\d+\.?\d*)$', value.strip())
    if not match:
        return None, None
    op = match.group(1) or "="
    num = float(match.group(2))
    return op, num


def apply_numeric_filter(query, column, filter_str):
    op, num = parse_filter(filter_str)
    if op is None:
        return query
    if op == "<=":
        query = query.filter(column <= num)
    elif op == ">=":
        query = query.filter(column >= num)
    elif op == "<":
        query = query.filter(column < num)
    elif op == ">":
        query = query.filter(column > num)
    else:
        query = query.filter(column == num)
    return query


def apply_calories_filter(db: Session, query, calories_filter: str):
    """Filter by calories extracted from JSON nutrients field"""
    op, num = parse_filter(calories_filter)
    if op is None:
        return query

    # Get all recipe IDs where calories match
    all_recipes = db.query(Recipe).all()
    matching_ids = []
    for r in all_recipes:
        if r.nutrients:
            cal_str = r.nutrients.get("calories", "")
            try:
                cal_val = float(re.sub(r"[^\d.]", "", cal_str))
                if op == "<=" and cal_val <= num:
                    matching_ids.append(r.id)
                elif op == ">=" and cal_val >= num:
                    matching_ids.append(r.id)
                elif op == "<" and cal_val < num:
                    matching_ids.append(r.id)
                elif op == ">" and cal_val > num:
                    matching_ids.append(r.id)
                elif op == "=" and cal_val == num:
                    matching_ids.append(r.id)
            except (ValueError, TypeError):
                pass

    return query.filter(Recipe.id.in_(matching_ids))


@app.get("/api/recipes")
def get_recipes(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * limit
    base_query = db.query(Recipe).order_by(Recipe.rating.desc().nulls_last())
    total = base_query.count()
    recipes = base_query.offset(offset).limit(limit).all()

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": [recipe_to_dict(r) for r in recipes],
    }


@app.get("/api/recipes/search")
def search_recipes(
    title: Optional[str] = Query(default=None),
    cuisine: Optional[str] = Query(default=None),
    calories: Optional[str] = Query(default=None),
    total_time: Optional[str] = Query(default=None),
    rating: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Recipe)

    if title:
        query = query.filter(Recipe.title.ilike(f"%{title}%"))

    if cuisine:
        query = query.filter(Recipe.cuisine.ilike(f"%{cuisine}%"))

    if total_time:
        query = apply_numeric_filter(query, Recipe.total_time, total_time)

    if rating:
        query = apply_numeric_filter(query, Recipe.rating, rating)

    if calories:
        query = apply_calories_filter(db, query, calories)

    query = query.order_by(Recipe.rating.desc().nulls_last())
    total = query.count()
    offset = (page - 1) * limit
    recipes = query.offset(offset).limit(limit).all()

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": [recipe_to_dict(r) for r in recipes],
    }


@app.get("/api/recipes/{recipe_id}")
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe_to_dict(recipe)


@app.get("/")
def root():
    return {"message": "Recipes API is running. Visit /docs for API documentation."}

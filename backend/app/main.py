from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from . import models, schemas, database
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=database.engine)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/categories/", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@app.get("/categories/{category_id}/questions/")
def get_questions_by_category(category_id: int, db: Session = Depends(get_db)):
    print(f"Fetching questions for category ID: {category_id}")
    # Use joinedload to eagerly load the options
    questions = db.query(models.Question)\
        .options(joinedload(models.Question.options))\
        .filter(models.Question.category_id == category_id)\
        .all()
    
    if not questions:
        raise HTTPException(status_code=404, detail="Category not found or no questions available")
    
    # Convert to dictionary with explicit option inclusion
    questions_data = []
    for question in questions:
        question_dict = {
            "id": question.id,
            "question_text": question.question_text,
            "explanation": question.explanation,
            "difficulty": question.difficulty,
            "options": [
                {
                    "id": option.id,
                    "text": option.text,
                    "is_correct": option.is_correct
                }
                for option in question.options
            ]
        }
        questions_data.append(question_dict)
    
    print(f"Returning {len(questions)} questions with their options")
    return questions_data

@app.post("/categories/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.post("/categories/{category_id}/questions/", response_model=schemas.Question)
def create_question(
    category_id: int,
    question: schemas.QuestionCreate,
    db: Session = Depends(get_db)
):
    db_question = models.Question(
        question_text=question.question_text,
        explanation=question.explanation,
        difficulty=question.difficulty,
        category_id=category_id
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    
    for option in question.options:
        db_option = models.Option(
            text=option.text,
            is_correct=option.is_correct,
            question_id=db_question.id
        )
        db.add(db_option)
    
    db.commit()
    db.refresh(db_question)
    return db_question

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
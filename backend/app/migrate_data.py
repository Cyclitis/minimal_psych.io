import json
import os
import re
from sqlalchemy.orm import Session
from . import models, database

def load_questions_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        # Extract the JSON-like object from the JavaScript file
        match = re.search(r'const\s+QUESTIONS\s*=\s*({[\s\S]*});?\s*$', content)
        if not match:
            raise ValueError("Could not find QUESTIONS object in the file")
        
        # Get the JSON-like string
        json_str = match.group(1)
        
        # Convert JavaScript object format to valid JSON:
        # 1. Replace single quotes with double quotes
        json_str = json_str.replace("'", '"')
        
        # 2. Add quotes around unquoted property names
        json_str = re.sub(r'([{,])\s*([a-zA-Z0-9_]+)\s*:', r'\1"\2":', json_str)
        
        # 3. Convert JavaScript booleans to JSON booleans
        json_str = json_str.replace('true', 'true').replace('false', 'false')
        
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"JSON parsing error at character {e.pos}:")
            print(json_str[max(0, e.pos-50):e.pos+50])  # Print context around the error
            raise

def migrate_data():
    # Create database tables
    models.Base.metadata.create_all(bind=database.engine)
    
    # Create a database session
    db = database.SessionLocal()
    
    try:
        # Get the absolute path to the questions.js file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        questions_path = os.path.join(current_dir, '..', '..', 'frontend', 'questions.js')
        
        print(f"Reading questions from: {questions_path}")
        
        # Load questions from the frontend directory
        questions_data = load_questions_file(questions_path)
        
        # Process each category and its questions
        for category_name, questions in questions_data.items():
            print(f"Processing category: {category_name}")
            
            # Create category
            db_category = models.Category(name=category_name)
            db.add(db_category)
            db.commit()
            db.refresh(db_category)
            
            # Add questions for this category
            for question in questions:
                db_question = models.Question(
                    question_text=question["question"],
                    explanation=question["explanation"],
                    difficulty=question["difficulty"],
                    category_id=db_category.id
                )
                db.add(db_question)
                db.commit()
                db.refresh(db_question)
                
                # Add options for this question
                for option in question["options"]:
                    db_option = models.Option(
                        text=option["text"],
                        is_correct=option["correct"],
                        question_id=db_question.id
                    )
                    db.add(db_option)
                
                db.commit()
                
        print("Data migration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    migrate_data() 
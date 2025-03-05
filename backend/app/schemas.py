from pydantic import BaseModel
from typing import List, Optional

class OptionBase(BaseModel):
    text: str
    is_correct: bool

class OptionCreate(OptionBase):
    pass

class Option(OptionBase):
    id: int
    question_id: int

    class Config:
        from_attributes = True

class QuestionBase(BaseModel):
    question_text: str
    explanation: str
    difficulty: str

class QuestionCreate(QuestionBase):
    options: List[OptionCreate]

class Question(QuestionBase):
    id: int
    category_id: int
    options: List[Option]

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    questions: List[Question]

    class Config:
        from_attributes = True 
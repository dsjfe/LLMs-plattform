from fastapi import APIRouter, Body, Query, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from app.core.question_generation import QuestionGenerator

# 创建路由
router = APIRouter()

# 定义请求和响应模型
class QuestionRequest(BaseModel):
    prompt: str
    num_questions: int = 5
    question_type: str = "multiple_choice"

class DocumentRequest(BaseModel):
    document_content: str
    num_questions: int = 5
    question_type: str = "multiple_choice"

class Question(BaseModel):
    id: str
    type: str
    content: str
    options: List[str] = []
    answer: str

class QuestionsResponse(BaseModel):
    questions: List[Question]

# 实例化题目生成器
question_generator = QuestionGenerator()

@router.post("/from-prompt", response_model=QuestionsResponse)
async def generate_questions_from_prompt(request: QuestionRequest):
    """
    通过提示词生成题目
    """
    try:
        questions = question_generator.generate_from_prompt(
            prompt=request.prompt,
            num_questions=request.num_questions,
            question_type=request.question_type
        )
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成题目失败: {str(e)}")

@router.post("/from-document", response_model=QuestionsResponse)
async def generate_questions_from_document(request: DocumentRequest):
    """
    通过文档内容生成题目
    """
    try:
        questions = question_generator.generate_from_document(
            document_content=request.document_content,
            num_questions=request.num_questions,
            question_type=request.question_type
        )
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成题目失败: {str(e)}")

@router.get("/export", response_model=QuestionsResponse)
async def export_questions(question_ids: List[str] = Query(...)):
    """
    导出指定ID的题目
    """
    # 实际项目中，这里会从数据库查询题目
    # 这里简单模拟返回题目
    questions = [
        {
            "id": qid,
            "type": "multiple_choice",
            "content": f"这是ID为{qid}的题目",
            "options": ["选项A", "选项B", "选项C", "选项D"],
            "answer": "选项A"
        } for qid in question_ids
    ]
    return {"questions": questions}
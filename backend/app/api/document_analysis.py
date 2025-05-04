from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import json

# 创建路由
router = APIRouter()

# 定义响应模型
class DocumentAnalysisResult(BaseModel):
    document_id: str
    document_name: str
    total_questions: int
    questions: List[Dict[str, Any]]

@router.post("/upload", response_model=DocumentAnalysisResult)
async def upload_document(
    file: UploadFile = File(...),
    question_type: str = Form("multiple_choice"),
    num_questions: int = Form(5)
):
    """
    上传文档并解析生成题目
    """
    try:
        # 实际项目中，这里会解析文档内容并调用大模型生成题目
        # 这里简单模拟返回解析结果
        document_content = await file.read()
        
        # 生成题目
        questions = [
            {
                "id": f"q{i+1}",
                "type": question_type,
                "content": f"这是从文档'{file.filename}'中提取的第{i+1}个问题",
                "options": ["选项A", "选项B", "选项C", "选项D"],
                "answer": "选项C"
            } for i in range(num_questions)
        ]
        
        return DocumentAnalysisResult(
            document_id=f"doc-{hash(file.filename) % 10000}",
            document_name=file.filename,
            total_questions=len(questions),
            questions=questions
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"文档解析失败: {str(e)}")

@router.get("/documents", response_model=List[Dict[str, Any]])
async def get_documents():
    """
    获取已上传的文档列表
    """
    # 实际项目中，这里会从数据库查询文档列表
    # 这里简单模拟返回文档列表
    documents = [
        {
            "id": "doc-1234",
            "name": "示例文档1.pdf",
            "upload_time": "2023-07-15T10:30:00Z",
            "total_questions": 10
        },
        {
            "id": "doc-5678",
            "name": "示例文档2.docx",
            "upload_time": "2023-07-16T14:20:00Z",
            "total_questions": 8
        }
    ]
    return documents

@router.get("/documents/{document_id}", response_model=DocumentAnalysisResult)
async def get_document_analysis(document_id: str):
    """
    获取指定文档的解析结果
    """
    # 实际项目中，这里会从数据库查询文档解析结果
    # 这里简单模拟返回文档解析结果
    questions = [
        {
            "id": f"q{i+1}",
            "type": "multiple_choice",
            "content": f"这是从文档'{document_id}'中提取的第{i+1}个问题",
            "options": ["选项A", "选项B", "选项C", "选项D"],
            "answer": "选项C"
        } for i in range(8)
    ]
    
    return DocumentAnalysisResult(
        document_id=document_id,
        document_name="示例文档.pdf",
        total_questions=len(questions),
        questions=questions
    )
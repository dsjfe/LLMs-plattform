from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field, validator
import json
import uuid
from datetime import datetime
from enum import Enum

# 创建路由
router = APIRouter(
    prefix="/documents",
    tags=["文档管理"]
)

# 定义题目类型枚举
class QuestionType(str, Enum):
    multiple_choice = "multiple_choice"
    true_false = "true_false"
    short_answer = "short_answer"
    essay = "essay"

# 基础题目模型
class BaseQuestion(BaseModel):
    id: str
    type: QuestionType
    content: str
    difficulty: float = Field(..., ge=1, le=5)
    score: int = Field(..., ge=1, le=20)

# 选择题模型
class MultipleChoiceQuestion(BaseQuestion):
    options: List[str] = Field(..., min_items=2, max_items=5)
    answer: str

# 判断题模型
class TrueFalseQuestion(BaseQuestion):
    answer: bool

# 简答题模型
class ShortAnswerQuestion(BaseQuestion):
    answer: str

# 论述题模型
class EssayQuestion(BaseQuestion):
    answer: str
    rubric: Optional[str]

# 联合类型题目
Question = Union[MultipleChoiceQuestion, TrueFalseQuestion, ShortAnswerQuestion, EssayQuestion]

# 文档分析结果模型
class DocumentAnalysisResult(BaseModel):
    document_id: str
    document_name: str
    upload_time: datetime
    total_questions: int
    questions: List[Question]
    analysis_time: datetime
    document_size: int
    content_preview: str = Field(..., max_length=500)

# 文档列表项模型
class DocumentListItem(BaseModel):
    document_id: str
    document_name: str
    upload_time: datetime
    total_questions: int
    document_size: int
    question_types: List[QuestionType]

# 文档上传请求模型
class DocumentUploadRequest(BaseModel):
    question_types: List[QuestionType] = [QuestionType.multiple_choice]
    num_questions: int = Field(5, ge=1, le=50)
    difficulty_level: float = Field(3.0, ge=1.0, le=5.0)
    include_answer: bool = True

# 题目生成器依赖
class QuestionGenerator:
    @staticmethod
    async def generate_from_document(content: bytes, request: DocumentUploadRequest) -> List[Question]:
        # 实际项目中，这里会调用大模型API生成题目
        # 模拟题目生成逻辑
        questions = []
        for i in range(request.num_questions):
            question_type = request.question_types[i % len(request.question_types)]
            question_id = f"q-{uuid.uuid4().hex[:8]}"
            
            if question_type == QuestionType.multiple_choice:
                questions.append(MultipleChoiceQuestion(
                    id=question_id,
                    type=question_type,
                    content=f"从文档中提取的选择题 {i+1}",
                    options=["选项A", "选项B", "选项C", "选项D"],
                    answer="选项C",
                    difficulty=request.difficulty_level,
                    score=5
                ))
            elif question_type == QuestionType.true_false:
                questions.append(TrueFalseQuestion(
                    id=question_id,
                    type=question_type,
                    content=f"从文档中提取的判断题 {i+1}",
                    answer=True,
                    difficulty=request.difficulty_level,
                    score=3
                ))
            elif question_type == QuestionType.short_answer:
                questions.append(ShortAnswerQuestion(
                    id=question_id,
                    type=question_type,
                    content=f"从文档中提取的简答题 {i+1}",
                    answer="这是简答题的答案",
                    difficulty=request.difficulty_level,
                    score=10
                ))
            else:  # essay
                questions.append(EssayQuestion(
                    id=question_id,
                    type=question_type,
                    content=f"从文档中提取的论述题 {i+1}",
                    answer="这是论述题的详细答案...",
                    rubric="评分标准：内容完整性、逻辑清晰性、语言表达",
                    difficulty=request.difficulty_level,
                    score=20
                ))
        
        return questions

@router.post("/upload", response_model=DocumentAnalysisResult)
async def upload_document(
    file: UploadFile = File(...),
    question_types: List[QuestionType] = Query([QuestionType.multiple_choice]),
    num_questions: int = Query(5, ge=1, le=50),
    difficulty_level: float = Query(3.0, ge=1.0, le=5.0),
    include_answer: bool = Query(True)
):
    """
    上传文档并解析生成题目
    
    - **file**: 要上传的文档文件
    - **question_types**: 题目类型列表，默认为选择题
    - **num_questions**: 生成的题目数量，范围1-50
    - **difficulty_level**: 题目难度，范围1.0-5.0
    - **include_answer**: 是否包含答案
    """
    try:
        # 验证文件类型
        if not file.content_type.startswith(("application/pdf", "text/plain", "application/msword", 
                                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document")):
            raise HTTPException(status_code=400, detail="不支持的文件类型")
        
        # 读取文件内容
        document_content = await file.read()
        
        # 生成唯一文档ID
        document_id = f"doc-{uuid.uuid4().hex[:12]}"
        
        # 构建请求对象
        request = DocumentUploadRequest(
            question_types=question_types,
            num_questions=num_questions,
            difficulty_level=difficulty_level,
            include_answer=include_answer
        )
        
        # 调用题目生成器
        questions = await QuestionGenerator.generate_from_document(document_content, request)
        
        # 生成文档预览
        preview_length = min(500, len(document_content))
        content_preview = document_content[:preview_length].decode('utf-8', errors='ignore') if isinstance(document_content, bytes) else document_content[:preview_length]
        
        # 返回结果
        return DocumentAnalysisResult(
            document_id=document_id,
            document_name=file.filename,
            upload_time=datetime.now(),
            total_questions=len(questions),
            questions=questions,
            analysis_time=datetime.now(),
            document_size=len(document_content),
            content_preview=content_preview
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"文档处理失败: {str(e)}")

@router.get("/", response_model=List[DocumentListItem])
async def get_documents(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    sort_by: str = Query("upload_time", regex="^(upload_time|total_questions|document_size)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$")
):
    """
    获取已上传的文档列表
    
    - **limit**: 每页返回的文档数量，最大100
    - **offset**: 偏移量，用于分页
    - **sort_by**: 排序字段，可选值：upload_time, total_questions, document_size
    - **sort_order**: 排序顺序，可选值：asc, desc
    """
    # 实际项目中，这里会从数据库查询文档列表
    # 模拟返回文档列表
    documents = [
        {
            "document_id": f"doc-{i+1:04d}",
            "document_name": f"示例文档{i+1}.pdf",
            "upload_time": datetime.now().isoformat(),
            "total_questions": (i+1) * 2,
            "document_size": (i+1) * 1024,
            "question_types": [QuestionType.multiple_choice, QuestionType.true_false]
        } for i in range(20)
    ]
    
    # 模拟排序
    reverse = sort_order == "desc"
    if sort_by == "upload_time":
        documents.sort(key=lambda x: x["upload_time"], reverse=reverse)
    elif sort_by == "total_questions":
        documents.sort(key=lambda x: x["total_questions"], reverse=reverse)
    else:  # document_size
        documents.sort(key=lambda x: x["document_size"], reverse=reverse)
    
    # 模拟分页
    paginated_docs = documents[offset:offset+limit]
    
    return [DocumentListItem(**doc) for doc in paginated_docs]

@router.get("/{document_id}", response_model=DocumentAnalysisResult)
async def get_document_analysis(document_id: str):
    """
    获取指定文档的解析结果
    
    - **document_id**: 文档ID
    """
    # 实际项目中，这里会从数据库查询文档解析结果
    # 模拟返回文档解析结果
    if not document_id.startswith("doc-"):
        raise HTTPException(status_code=404, detail="文档不存在")
    
    questions = []
    for i in range(8):
        question_id = f"q-{uuid.uuid4().hex[:8]}"
        questions.append(MultipleChoiceQuestion(
            id=question_id,
            type=QuestionType.multiple_choice,
            content=f"从文档'{document_id}'中提取的第{i+1}个问题",
            options=["选项A", "选项B", "选项C", "选项D"],
            answer="选项C",
            difficulty=3.5,
            score=5
        ))
    
    return DocumentAnalysisResult(
        document_id=document_id,
        document_name="示例文档.pdf",
        upload_time=datetime.now(),
        total_questions=len(questions),
        questions=questions,
        analysis_time=datetime.now(),
        document_size=102400,
        content_preview="这是文档的预览内容..."
    )

@router.delete("/{document_id}", response_model=Dict[str, str])
async def delete_document(document_id: str):
    """
    删除指定文档
    
    - **document_id**: 文档ID
    """
    # 实际项目中，这里会从数据库和存储中删除文档
    # 模拟删除操作
    if not document_id.startswith("doc-"):
        raise HTTPException(status_code=404, detail="文档不存在")
    
    # 模拟删除耗时操作
    import time
    time.sleep(0.5)
    
    return {"message": f"文档 {document_id} 已成功删除"}

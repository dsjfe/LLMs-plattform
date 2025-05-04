# API路由初始化文件
from fastapi import APIRouter

# 创建主路由
api_router = APIRouter()

# 导入各模块路由
from app.api.question_generation import router as question_router
from app.api.model_evaluation import router as evaluation_router
from app.api.document_analysis import router as document_router
from app.api.data_management import router as data_router

# 注册各模块路由
api_router.include_router(question_router, prefix="/question-generation", tags=["题目生成"])
api_router.include_router(evaluation_router, prefix="/model-evaluation", tags=["模型评测"])
api_router.include_router(document_router, prefix="/document-analysis", tags=["文档拆解"])
api_router.include_router(data_router, prefix="/data-management", tags=["数据管理"])
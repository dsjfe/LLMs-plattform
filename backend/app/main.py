from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(
    title="大模型评测平台",
    description="支持题目生成、模型评测、文档拆解出题及题目格式转换等功能",
    version="0.1.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置为特定域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 导入路由
# from app.api.routes import question_generation, model_evaluation, document_analysis, data_management

@app.get("/")
async def root():
    return {"message": "欢迎使用大模型评测平台API"}

# 题目生成模块API
@app.get("/api/question-generation")
async def get_question_generation():
    return {"message": "题目生成模块API"}

# 模型评测模块API
@app.get("/api/model-evaluation")
async def get_model_evaluation():
    return {"message": "模型评测模块API"}

# 文档拆解模块API
@app.get("/api/document-analysis")
async def get_document_analysis():
    return {"message": "文档拆解模块API"}

# 数据管理与格式转换模块API
@app.get("/api/data-management")
async def get_data_management():
    return {"message": "数据管理与格式转换模块API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
from fastapi import APIRouter, Body, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import json
import os
from pathlib import Path

# 创建路由
router = APIRouter()

# 定义请求和响应模型
class ImportRequest(BaseModel):
    data_type: str  # questions, evaluation_results, etc.
    content: Dict[str, Any]

class ExportRequest(BaseModel):
    data_type: str  # questions, evaluation_results, etc.
    ids: List[str]
    format: str = "json"  # json, csv, etc.

@router.post("/import")
async def import_data(request: ImportRequest):
    """
    导入数据（题目、评测结果等）
    """
    try:
        # 实际项目中，这里会将数据保存到数据库
        # 这里简单模拟导入成功
        return {
            "success": True,
            "message": f"成功导入{request.data_type}数据",
            "imported_count": len(request.content.get("items", [])) if "items" in request.content else 1
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"数据导入失败: {str(e)}")

@router.post("/import-file")
async def import_data_file(file: UploadFile = File(...)):
    """
    通过文件导入数据
    """
    try:
        # 实际项目中，这里会解析文件内容并保存到数据库
        # 这里简单模拟导入成功
        content = await file.read()
        
        # 尝试解析JSON文件
        try:
            data = json.loads(content)
            item_count = len(data.get("items", [])) if "items" in data else 1
        except:
            # 非JSON文件或格式不正确
            item_count = 1
        
        return {
            "success": True,
            "message": f"成功导入文件 {file.filename}",
            "imported_count": item_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"文件导入失败: {str(e)}")

@router.post("/export")
async def export_data(request: ExportRequest):
    """
    导出数据（题目、评测结果等）
    """
    try:
        # 实际项目中，这里会从数据库查询数据并格式化
        # 这里简单模拟导出数据
        data = {
            "data_type": request.data_type,
            "items": [
                {
                    "id": item_id,
                    "name": f"{request.data_type}_{item_id}",
                    "content": f"这是{request.data_type} {item_id}的内容"
                } for item_id in request.ids
            ]
        }
        
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"数据导出失败: {str(e)}")

@router.post("/export-file")
async def export_data_file(request: ExportRequest = Body(...)):
    """
    导出数据到文件
    """
    try:
        # 实际项目中，这里会从数据库查询数据并生成文件
        # 这里简单模拟生成文件并返回
        
        # 生成临时文件路径
        temp_dir = Path("./temp")
        temp_dir.mkdir(exist_ok=True)
        
        file_name = f"{request.data_type}_export.{request.format}"
        file_path = temp_dir / file_name
        
        # 生成示例数据
        data = {
            "data_type": request.data_type,
            "items": [
                {
                    "id": item_id,
                    "name": f"{request.data_type}_{item_id}",
                    "content": f"这是{request.data_type} {item_id}的内容"
                } for item_id in request.ids
            ]
        }
        
        # 写入文件
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # 返回文件下载响应
        return FileResponse(
            path=file_path,
            filename=file_name,
            media_type="application/json"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"文件导出失败: {str(e)}")

@router.get("/formats")
async def get_supported_formats():
    """
    获取支持的数据格式
    """
    formats = [
        {"id": "json", "name": "JSON", "description": "JavaScript Object Notation"},
        {"id": "csv", "name": "CSV", "description": "Comma-Separated Values"},
        {"id": "xlsx", "name": "Excel", "description": "Microsoft Excel 文件"}
    ]
    return formats
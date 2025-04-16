# 大模型评测平台

基于前后端分离架构的大模型评测平台，支持题目生成、模型评测、文档拆解出题及题目格式转换等功能。

## 项目结构

```
├── frontend/                # 前端项目目录
│   ├── public/              # 静态资源
│   ├── src/                 # 源代码
│   │   ├── components/      # 组件
│   │   ├── pages/           # 页面
│   │   ├── services/        # API服务
│   │   ├── utils/           # 工具函数
│   │   ├── App.jsx          # 应用入口
│   │   └── main.jsx         # 主入口
│   ├── package.json         # 依赖配置
│   └── README.md            # 前端说明文档
│
├── backend/                 # 后端项目目录
│   ├── app/                 # 应用代码
│   │   ├── api/             # API路由
│   │   ├── core/            # 核心功能
│   │   ├── models/          # 数据模型
│   │   ├── services/        # 服务层
│   │   └── utils/           # 工具函数
│   ├── tests/               # 测试代码
│   ├── requirements.txt     # 依赖配置
│   └── README.md            # 后端说明文档
│
├── docker/                  # Docker配置
│   ├── frontend/            # 前端Docker配置
│   └── backend/             # 后端Docker配置
│
├── docs/                    # 项目文档
│   └── 开发文档              # 开发文档
│
└── README.md                # 项目说明文档
```

## 核心功能

1. **题目生成模块**
   - 支持通过提示词调用自主训练大模型自动出题
   - 支持文档拆解自动生成题目
   - 题目可导出为JSON等标准格式

2. **模型评测模块**
   - 支持对接多种主流大模型（如ChatGPT、GLM、文心一言等）
   - 自动化批量评测，收集模型输出与评分

3. **文档拆解模块**
   - 支持上传文档，自动解析并生成题目

4. **数据管理与格式转换模块**
   - 题目、评测结果等支持多格式导入导出（如JSON、CSV）

## 技术栈

- **前端**：React（配合MUI/Ant Design组件库）
- **后端**：Python + FastAPI
- **数据库**：MongoDB
- **大模型集成**：支持本地模型推理（如Transformers）、云端API调用（如OpenAI、百度文心等）
- **文档处理**：PyPDF2、docx、langchain等库

## 开发与部署

- 采用Docker容器化部署，便于环境一致性和扩展
- 前后端分离开发，通过RESTful API交互
- 关注数据安全与隐私保护

## 后续扩展

- 支持更多模型接入
- 增加评测指标与可视化分析
- 支持多用户权限管理
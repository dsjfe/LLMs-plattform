import requests
import json
import re
from json import JSONDecodeError  # 导入 JSONDecodeError

# 题目生成模块核心功能

class QuestionGenerator:
    """
    题目生成器类，支持通过提示词调用大模型自动出题和文档拆解自动生成题目
    """
    
    def __init__(self, model_name="ft:LoRA/Qwen/Qwen2.5-7B-Instruct:blbf85g1o3:model_1:tnyurufpcvwllsppoklo-ckpt_step_563"):
        """
        初始化题目生成器
        
        Args:
            model_name: 使用的大模型名称
        """
        self.model_name = model_name
    
    def generate_from_prompt(self, prompt, num_questions=5, question_type="multiple_choice"):
        """
        通过提示词生成题目
        """
        api_url = "https://api.siliconflow.cn/v1/chat/completions"
        headers = {
            "Authorization": "Bearer sk-xuppwoxsfwevhabycfqnklyxkvkgtwrdysrxjfzbyrvbmxpm",
            "Content-Type": "application/json"
        }
        # 构造messages内容，要求大模型返回结构化题目数据
        user_content = (
            f"你是一个智能出题助手。请严格按照如下要求生成{num_questions}道{question_type}题目：\n\n"
            f"【格式要求】\n"
            f"1. 只输出JSON格式，必须用markdown代码块包裹（```json ... ```）。\n"
            f"2. 不要输出任何解释、说明或与题目无关的内容。\n"
            f"3. 每道题必须包含以下字段，所有字段名和字符串值都必须用英文双引号：\n"
            f"   - \"id\": 数字，从1开始递增\n"
            f"   - \"type\": 字符串，值为\"multiple_choice\"\n"
            f"   - \"content\": 字符串，题目内容\n"
            f"   - \"options\": 字符串数组，必须包含4个选项，每个选项必须以\"A. \", \"B. \", \"C. \", \"D. \"开头\n"
            f"   - \"answer\": 字符串，只能是\"A\"、\"B\"、\"C\"或\"D\"中的一个\n\n"
            f"【返回格式示例】\n"
            f"```json\n"
            f"[\n"
            f"  {{\n"
            f"    \"id\": 1,\n"
            f"    \"type\": \"multiple_choice\",\n"
            f"    \"content\": \"题干内容\",\n"
            f"    \"options\": [\"A. 选项1\", \"B. 选项2\", \"C. 选项3\", \"D. 选项4\"],\n"
            f"    \"answer\": \"A\"\n"
            f"  }}\n"
            f"]\n"
            f"```\n\n"
            f"【题目要求】\n"
            f"根据以下提示词生成题目：{prompt}\n"
        )
        payload = {
            "model": "Qwen/QwQ-32B",
            "messages": [
                {
                    "role": "user",
                    "content": user_content
                }
            ],
            "stream": False,
            "max_tokens": 2048,
            "enable_thinking": False,
            "thinking_budget": 512,
            "min_p": 0.05,
            "stop": None,
            "temperature": 0.5,  # 降低温度使输出更确定性
            "top_p": 0.9,       # 提高top_p使输出更可控
            "top_k": 50,
            "frequency_penalty": 0.5,
            "n": 1,
            # 删除或注释掉这一行
            # "response_format": {"type": "json_object"},
            "tools": [
                {
                    "type": "function",
                    "function": {
                        "description": "",
                        "name": "",
                        "parameters": {},
                        "strict": False
                    }
                }
            ]
        }

        try:
            response = requests.post(api_url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            result = response.json()
            content = result["choices"][0]["message"]["content"]

            # ==== JSON处理与文件写入 ====
            # 1. 提取JSON代码块
            json_str = re.search(r'```json\n(.*?)\n```', content, re.DOTALL).group(1).strip()

            # 2. 预处理修复常见错误（网页1、网页3）
            json_str = re.sub(r"(?<!\\)'", '"', json_str)  # 单引号转双引号
            json_str = re.sub(r',\s*([}\]])', r'\1', json_str)  # 去除末尾多余逗号
            # 确保属性名用双引号括起来
            json_str = re.sub(r'(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', json_str)
            # 确保元素之间有逗号分隔
            json_str = re.sub(r'}\s*{', r'},{', json_str)  # 在两个对象之间添加逗号

            # 3. 解析JSON数据（网页4）
            try:
                questions = json.loads(json_str)
                # 将每个题目的 id 转换为字符串
                for question in questions:
                    question["id"] = str(question["id"])
            except JSONDecodeError as e:
                # 使用激进修复策略（网页6）
                json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)  # 移除控制字符
                questions = json.loads(json_str)
                # 将每个题目的 id 转换为字符串
                for question in questions:
                    question["id"] = str(question["id"])

            # 4. 使用json.dump写入文件（网页2、网页5）
            output_path = "generated_questions.json"
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(
                    {"questions": questions},
                    f,
                    ensure_ascii=False,  # 保留中文（网页3）
                    indent=4,           # 美化格式（网页4）
                    separators=(',', ': ')
                )
            
            print(f"题目已保存至 {output_path}")
            return questions

        except Exception as e:
            print(f"处理失败: {str(e)}")
            if 'response' in locals():
                print("原始响应:", response.text[:200])  # 截取部分内容用于调试
            return []
       
    
    def generate_from_document(self, document_content, num_questions=5, question_type="multiple_choice"):
        """
        通过文档内容生成题目
        
        Args:
            document_content: 文档内容
            num_questions: 生成题目数量
            question_type: 题目类型，如选择题、填空题等
            
        Returns:
            生成的题目列表
        """
        # 实际项目中，这里会解析文档并调用大模型API
        questions = []
        # 模拟生成题目
        for i in range(num_questions):
            question = {
                "id": f"q{i+1}",
                "type": question_type,
                "content": f"这是一道基于文档内容生成的{question_type}题目",
                "options": ["选项A", "选项B", "选项C", "选项D"],
                "answer": "选项B"
            }
            questions.append(question)
        return questions
    
    def export_to_json(self, questions):
        """
        将题目导出为JSON格式
        
        Args:
            questions: 题目列表
            
        Returns:
            JSON格式的题目
        """
        return {"questions": questions}
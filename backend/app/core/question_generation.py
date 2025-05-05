import requests
import json

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
            # 获取模型返回的内容
            content = result["choices"][0]["message"]["content"]
            import re
            
            # 1. 提取JSON代码块
            match = re.search(r"```json\s*(.*?)\s*```", content, re.DOTALL)
            if match:
                json_str = match.group(1).strip()
            else:
                # 尝试直接解析整个内容，可能模型没有使用代码块
                json_str = content.strip()
                print("未检测到JSON代码块，尝试直接解析内容")
            
            # 2. 预处理JSON字符串
            # 替换单引号为双引号
            json_str = re.sub(r"(?<!\\)'", '"', json_str)
            # 去除 "answer": 后的换行符
            json_str = re.sub(r'("answer":)\s*\n\s*', r'\1 ', json_str)
            # 补全未加引号的key（如 options: -> "options":）
            json_str = re.sub(r'(\{|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', json_str)
            # 补全未加引号的选项key（如 {A: 4} -> {"A": 4}）
            json_str = re.sub(r'\{([A-D])\s*:', r'{"\1":', json_str)
            # 去除末尾多余逗号
            json_str = re.sub(r',\s*([\]}])', r'\1', json_str)
            # 兼容最后一个元素后多余逗号
            json_str = re.sub(r',\s*]', ']', json_str)
            # 修复可能的JSON格式问题
            json_str = re.sub(r'("[^"]*)(\n)([^"]*")', r'\1\\n\3', json_str)  # 修复字符串中的换行
            json_str = re.sub(r'("[^"]*)(\t)([^"]*")', r'\1\\t\3', json_str)  # 修复字符串中的制表符
            
            
            print("即将解析的json_str内容：", json_str)


            # 3. 尝试解析JSON
            try:
                questions_data = json.loads(json_str)
            except Exception as e2:
                print("第一次json.loads解析失败，尝试进一步修复：")
                try:
                    # 尝试更激进的修复方法
                    # 移除所有控制字符
                    json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)
                    # 确保所有字符串都有引号
                    json_str = re.sub(r':\s*([^{\[\d"true\s,false\s,null\s}\]]+)([,}\]])', r': "\1"\2', json_str)
                    print("修复后的json_str：", json_str)
                    questions_data = json.loads(json_str)
                except Exception as e3:
                    print("修复后仍然解析失败，原始json_str如下：")
                    print(json_str)
                    print("最终解析异常：", e3)
                    
                    return []
            # 4. 验证和规范化题目格式
            questions = []
            if isinstance(questions_data, dict) and "questions" in questions_data:
                questions = questions_data["questions"]
            elif isinstance(questions_data, list):
                questions = questions_data
            else:
                return []
            
            # 5. 确保每个题目格式正确
            valid_questions = []
            for q in questions:
                try:
                    # 确保必要字段存在
                    if not all(k in q for k in ["id", "type", "content", "options", "answer"]):
                        continue
                    
                    # 去掉题目内容中的引号
                    # q["content"] = q["content"].replace('"', '').replace("'", "")
                    
                    # 确保选项是列表且有4个选项
                    if not isinstance(q["options"], list) or len(q["options"]) != 4:
                        # 尝试修复选项
                        if isinstance(q["options"], str):
                            q["options"] = [f"A. {q['options']}", "B. 选项B", "C. 选项C", "D. 选项D"]
                        else:
                            continue
                    
                    # 确保选项格式正确（A. B. C. D.）
                    for i, opt in enumerate(q["options"]):
                        prefix = chr(65 + i) + ". "  # A. B. C. D.
                        if not opt.startswith(prefix):
                            q["options"][i] = f"{prefix}{opt}"
                    
                    # 确保答案格式正确
                    if q["answer"] not in ["A", "B", "C", "D"]:
                        # 尝试修复答案
                        if q["answer"].startswith("A") or q["answer"].lower() == "a":
                            q["answer"] = "A"
                        elif q["answer"].startswith("B") or q["answer"].lower() == "b":
                            q["answer"] = "B"
                        elif q["answer"].startswith("C") or q["answer"].lower() == "c":
                            q["answer"] = "C"
                        elif q["answer"].startswith("D") or q["answer"].lower() == "d":
                            q["answer"] = "D"
                        else:
                            q["answer"] = "A"  # 默认选A
                    
                    valid_questions.append(q)
                except Exception as e:
                    print(f"题目格式验证失败: {e}")
                    continue
            
            return valid_questions
        except Exception as e:
            print(f"调用大模型API失败: {e}")
            if 'response' in locals():
                print("模型API返回内容：", response.text)
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
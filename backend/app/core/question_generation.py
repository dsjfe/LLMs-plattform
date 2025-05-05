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
            f"请根据以下提示词生成{num_questions}道{question_type}题目，"
            f"每道题请包含题干、4个选项和标准答案，返回JSON格式，字段为id、type、content、options、answer。"
            f"提示词：{prompt}"
        )
        payload = {
            "model": self.model_name,
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
            "temperature": 0.7,
            "top_p": 0.7,
            "top_k": 50,
            "frequency_penalty": 0.5,
            "n": 1,
            "response_format": {"type": "text"},
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
            # 假设返回格式为 result["choices"][0]["message"]["content"]
            content = result["choices"][0]["message"]["content"]
            # 解析大模型返回的JSON字符串
            questions_data = json.loads(content)
            # 兼容返回直接为题目列表或带"questions"字段
            if isinstance(questions_data, dict) and "questions" in questions_data:
                return questions_data["questions"]
            elif isinstance(questions_data, list):
                return questions_data
            else:
                return []
        except Exception as e:
            print(f"调用大模型API失败: {e}")
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
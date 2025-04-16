# 题目生成模块核心功能

class QuestionGenerator:
    """
    题目生成器类，支持通过提示词调用大模型自动出题和文档拆解自动生成题目
    """
    
    def __init__(self, model_name="gpt-3.5-turbo"):
        """
        初始化题目生成器
        
        Args:
            model_name: 使用的大模型名称
        """
        self.model_name = model_name
    
    def generate_from_prompt(self, prompt, num_questions=5, question_type="multiple_choice"):
        """
        通过提示词生成题目
        
        Args:
            prompt: 提示词
            num_questions: 生成题目数量
            question_type: 题目类型，如选择题、填空题等
            
        Returns:
            生成的题目列表
        """
        # 实际项目中，这里会调用大模型API
        questions = []
        # 模拟生成题目
        for i in range(num_questions):
            question = {
                "id": f"q{i+1}",
                "type": question_type,
                "content": f"这是一道由{self.model_name}基于提示词生成的{question_type}题目",
                "options": ["选项A", "选项B", "选项C", "选项D"],
                "answer": "选项A"
            }
            questions.append(question)
        return questions
    
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
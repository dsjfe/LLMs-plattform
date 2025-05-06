import { useState } from 'react';
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';

// 题目设置组件 - 抽取自原PromptGeneration组件
const QuestionSettings = ({ 
  questionType, 
  setQuestionType, 
  difficulty, 
  setDifficulty, 
  numQuestions, 
  setNumQuestions 
}) => {
  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>题目类型</InputLabel>
        <Select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          label="题目类型"
        >
          <MenuItem value="multiple_choice">选择题</MenuItem>
          <MenuItem value="true_false">判断题</MenuItem>
          <MenuItem value="short_answer">简答题</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        type="number"
        label="题目数量"
        value={numQuestions}
        onChange={(e) => setNumQuestions(Number(e.target.value))}
        inputProps={{ min: 1, max: 30 }}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>难度</InputLabel>
        <Select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          label="难度"
        >
          <MenuItem value="easy">简单</MenuItem>
          <MenuItem value="medium">中等</MenuItem>
          <MenuItem value="hard">困难</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

// 题目预览组件 - 抽取自原PromptGeneration组件
const QuestionPreview = ({ questions }) => {
  return (
    <Box>
      {questions.length > 0 ? (
        questions.map((question) => (
          <Card key={question.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                {question.question}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {question.options && question.options.map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    color={option.charAt(0) === question.answer ? 'primary' : 'default'}
                    sx={{
                      mr: 1,
                      mb: 1,
                      display: 'block',
                      textAlign: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ mt: 1 }}>
                {question.difficulty && (
                  <Chip
                    label={`难度: ${question.difficulty}`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                )}
                <Chip
                  label={`类型: ${question.type}`}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          暂无生成的题目，请先生成题目
        </Typography>
      )}
    </Box>
  );
};

// 提示词生成组件 - 重构后的组件
const PromptGeneration = () => {
  const [promptText, setPromptText] = useState('');
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [difficulty, setDifficulty] = useState('medium');
  const [category, setCategory] = useState('general');
  const [numQuestions, setNumQuestions] = useState(5);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 调用后端API生成题目
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/question-generation/from-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          num_questions: numQuestions,
          question_type: questionType,
          difficulty: difficulty,
          category: category
        }),
      });
      if (!response.ok) {
        throw new Error('生成题目失败');
      }
      const data = await response.json();
      setGeneratedQuestions(
        data.questions.map(q => ({
          id: q.id,
          question: q.content,
          type: q.type,
          options: q.options,
          answer: q.answer,
          difficulty: q.difficulty || difficulty
        }))
      );
    } catch (error) {
      setGeneratedQuestions([]);
      alert('生成题目失败，请重试');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>提示词设置</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="请输入提示词..."
              sx={{ mb: 2 }}
            />
            <QuestionSettings 
              questionType={questionType}
              setQuestionType={setQuestionType}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              numQuestions={numQuestions}
              setNumQuestions={setNumQuestions}
            />
            <Button
              variant="contained"
              onClick={handleGenerate}
              startIcon={<AddIcon />}
              fullWidth
              disabled={loading}
            >
              {loading ? '生成中...' : '生成题目'}
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>生成的题目</Typography>
            <QuestionPreview questions={generatedQuestions} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// 文档拆解生成组件 - 新增组件
const DocumentBasedGeneration = () => {
  const [file, setFile] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // 这里可以添加文件预览逻辑
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentText(e.target.result);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleGenerate = async () => {
    if (!file && !documentText) {
      alert('请先上传文档或输入文档内容');
      return;
    }

    setLoading(true);
    try {
      // 这里应该调用后端API，上传文件或发送文档内容
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('document_text', documentText);
      }
      formData.append('num_questions', numQuestions);
      formData.append('question_type', questionType);
      formData.append('difficulty', difficulty);

      const response = await fetch('http://localhost:8000/api/question-generation/from-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('生成题目失败');
      }

      const data = await response.json();
      setGeneratedQuestions(
        data.questions.map(q => ({
          id: q.id,
          question: q.content,
          type: q.type,
          options: q.options,
          answer: q.answer,
          difficulty: q.difficulty || difficulty
        }))
      );
    } catch (error) {
      setGeneratedQuestions([]);
      alert('生成题目失败，请重试');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>文档上传</Typography>
            <Box 
              sx={{ 
                border: '2px dashed', 
                borderColor: 'primary.light', 
                borderRadius: 1, 
                p: 3, 
                textAlign: 'center',
                mb: 2 
              }}
            >
              <input
                accept=".txt,.pdf,.docx"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadFileIcon />}
                >
                  上传文档
                </Button>
              </label>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                支持 .txt, .pdf, .docx 格式
              </Typography>
              {file && (
                <Chip
                  label={file.name}
                  onDelete={() => setFile(null)}
                  sx={{ mt: 1 }}
                />
              )}
            </Box>

            <Typography variant="h6" gutterBottom>或直接输入文档内容</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="请输入文档内容..."
              sx={{ mb: 2 }}
            />

            <QuestionSettings 
              questionType={questionType}
              setQuestionType={setQuestionType}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              numQuestions={numQuestions}
              setNumQuestions={setNumQuestions}
            />

            <Button
              variant="contained"
              onClick={handleGenerate}
              startIcon={<DescriptionIcon />}
              fullWidth
              disabled={loading}
            >
              {loading ? '生成中...' : '从文档生成题目'}
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>生成的题目</Typography>
            <QuestionPreview questions={generatedQuestions} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// 题目编辑组件 - 新增组件
const QuestionEditor = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // 模拟加载已保存的题目
  useState(() => {
    // 这里应该从后端API获取已保存的题目
    const savedQuestions = [
      {
        id: 1,
        question: '什么是大语言模型？',
        type: '简答题',
        options: [],
        answer: '大语言模型是基于深度学习的自然语言处理模型，能够理解和生成人类语言。',
        difficulty: '简单'
      },
      {
        id: 2,
        question: '以下哪项不是大语言模型的应用场景？',
        type: '选择题',
        options: ['A. 文本生成', 'B. 问答系统', 'C. 图像识别', 'D. 情感分析'],
        answer: 'C',
        difficulty: '中等'
      }
    ];
    setQuestions(savedQuestions);
  }, []);

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    // 这里应该打开编辑对话框
  };

  const handleSaveQuestions = () => {
    // 这里应该调用后端API保存题目
    alert('题目已保存');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">已保存的题目</Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveQuestions}
        >
          保存所有题目
        </Button>
      </Box>
      
      {questions.length > 0 ? (
        questions.map((question) => (
          <Card key={question.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle1" gutterBottom>
                  {question.question}
                </Typography>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditQuestion(question)}
                >
                  编辑
                </Button>
              </Box>
              
              {question.options && question.options.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {question.options.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      color={option.charAt(0) === question.answer ? 'primary' : 'default'}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
              
              {question.answer && !question.options.length && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  答案: {question.answer}
                </Typography>
              )}
              
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={`难度: ${question.difficulty}`}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`类型: ${question.type}`}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          暂无保存的题目
        </Typography>
      )}
    </Box>
  );
};

// 主组件：整合所有子组件
const QuestionGenerationPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="题目生成选项卡">
          <Tab label="提示词生成" />
          <Tab label="文档拆解生成" />
          <Tab label="题目编辑" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && <PromptGeneration />}
      {tabValue === 1 && <DocumentBasedGeneration />}
      {tabValue === 2 && <QuestionEditor />}
    </Box>
  );
};

export default QuestionGenerationPage;
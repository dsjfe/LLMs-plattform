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

// 提示词生成组件
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
          // 可根据后端返回补充其它字段
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
            {/* 新增：题目数量输入框 */}
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
            {generatedQuestions.map((question) => (
              <Card key={question.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {question.question}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {question.options.map((option, index) => (
                      <Chip
                        key={index}
                        label={option}
                        color={option === question.answer ? 'primary' : 'default'}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
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
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// 新增：定义QuestionGenerationPage组件
const QuestionGenerationPage = () => {
  return <PromptGeneration />;
};

export default QuestionGenerationPage;
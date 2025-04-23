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
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  // 模拟生成题目
  const handleGenerate = () => {
    // 这里将来会调用API生成题目
    const mockQuestions = [
      {
        id: 1,
        question: '以下哪个模型是由OpenAI开发的？',
        type: 'multiple_choice',
        options: ['Claude', 'GPT-4', 'LLaMA', 'PaLM'],
        answer: 'GPT-4',
        difficulty: 'easy',
      },
      {
        id: 2,
        question: '大语言模型的训练过程中，什么是"微调"？',
        type: 'multiple_choice',
        options: ['预训练的延续', '从零开始训练', '数据增强', '模型压缩'],
        answer: '预训练的延续',
        difficulty: 'medium'
      }]
    setGeneratedQuestions(mockQuestions);
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
            >
              生成题目
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

export default PromptGeneration;
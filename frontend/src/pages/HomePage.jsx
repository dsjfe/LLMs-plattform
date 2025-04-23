import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  Paper,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import QuizIcon from '@mui/icons-material/Quiz';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// 模拟数据
const mockStats = {
  totalQuestions: 1250,
  totalModels: 8,
  totalEvaluations: 42,
  documentsProcessed: 15,
};

const mockRecentEvaluations = [
  {
    id: 1,
    name: 'GPT-4与国产大模型对比评测',
    date: '2023-06-15',
    models: ['GPT-4', 'ChatGLM', '文心一言'],
    score: 85,
  },
  {
    id: 2,
    name: '金融领域专业知识评测',
    date: '2023-06-10',
    models: ['GPT-3.5', 'Llama-2'],
    score: 78,
  },
  {
    id: 3,
    name: '医疗问答能力评测',
    date: '2023-06-05',
    models: ['Claude', 'Bard', 'Ernie'],
    score: 92,
  },
];

const HomePage = () => {
  const [stats, setStats] = useState(mockStats);
  const [recentEvaluations, setRecentEvaluations] = useState(mockRecentEvaluations);
  const [loading, setLoading] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    // 这里将来会从API获取数据
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {loading && <LinearProgress />}
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          平台概览
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          欢迎使用大模型评测平台，您可以在这里进行模型评测、题目生成和文档分析
        </Typography>
      </Box>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="题目总数"
            value={stats.totalQuestions}
            icon={<QuizIcon sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="模型数量"
            value={stats.totalModels}
            icon={<ModelTrainingIcon sx={{ color: 'secondary.main' }} />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="评测任务"
            value={stats.totalEvaluations}
            icon={<AssessmentIcon sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="处理文档"
            value={stats.documentsProcessed}
            icon={<DescriptionIcon sx={{ color: 'info.main' }} />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* 最近评测结果 */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            最近评测结果
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            size="small"
          >
            查看全部
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          {recentEvaluations.map((evaluation) => (
            <ListItem key={evaluation.id} alignItems="flex-start" sx={{ px: 1 }}>
              <ListItemIcon>
                <AssessmentIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'medium' }}>
                    {evaluation.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary" component="span">
                      评测日期: {evaluation.date}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                        评测模型:
                      </Typography>
                      {evaluation.models.map((model) => (
                        <Chip
                          key={model}
                          label={model}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                }
              />
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
                <Typography
                  variant="h6"
                  component="span"
                  sx={{
                    fontWeight: 'bold',
                    color:
                      evaluation.score >= 90
                        ? 'success.main'
                        : evaluation.score >= 70
                        ? 'primary.main'
                        : 'warning.main',
                  }}
                >
                  {evaluation.score}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                  分
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* 快速入口 */}
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        快速入口
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
            <CardHeader
              title="题目生成"
              titleTypographyProps={{ variant: 'h6' }}
              avatar={<QuizIcon color="primary" />}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                通过提示词或文档拆解自动生成评测题目，支持多种题型和导出格式。
              </Typography>
              <Button
                variant="text"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 2 }}
                href="/question-generation"
              >
                开始生成
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
            <CardHeader
              title="模型评测"
              titleTypographyProps={{ variant: 'h6' }}
              avatar={<AssessmentIcon color="secondary" />}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                对多个大模型进行对比评测，获取详细的评测报告和性能分析。
              </Typography>
              <Button
                variant="text"
                color="secondary"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 2 }}
                href="/model-evaluation"
              >
                开始评测
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
            <CardHeader
              title="文档拆解"
              titleTypographyProps={{ variant: 'h6' }}
              avatar={<DescriptionIcon color="info" />}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                上传文档自动解析内容，生成相关题目，支持多种文档格式。
              </Typography>
              <Button
                variant="text"
                color="info"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 2 }}
                href="/document-analysis"
              >
                开始拆解
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
            <CardHeader
              title="数据管理"
              titleTypographyProps={{ variant: 'h6' }}
              avatar={<ModelTrainingIcon color="success" />}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                管理题目库和评测结果，支持多种格式导入导出和数据分析。
              </Typography>
              <Button
                variant="text"
                color="success"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 2 }}
                href="/data-management"
              >
                数据管理
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
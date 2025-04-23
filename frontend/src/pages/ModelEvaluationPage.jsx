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
  Grid,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';

// 模型选择组件
const ModelSelection = () => {
  const [selectedModels, setSelectedModels] = useState(['gpt-4', 'chatglm']);

  const handleModelToggle = (modelId) => {
    const currentIndex = selectedModels.indexOf(modelId);
    const newSelectedModels = [...selectedModels];

    if (currentIndex === -1) {
      newSelectedModels.push(modelId);
    } else {
      newSelectedModels.splice(currentIndex, 1);
    }

    setSelectedModels(newSelectedModels);
  };

  const models = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', avatar: '🤖', color: '#10a37f' },
    { id: 'gpt-3.5', name: 'GPT-3.5', provider: 'OpenAI', avatar: '🤖', color: '#10a37f' },
    { id: 'chatglm', name: 'ChatGLM', provider: '智谱AI', avatar: '🧠', color: '#4285f4' },
    { id: 'wenxin', name: '文心一言', provider: '百度', avatar: '🐼', color: '#2932e1' },
    { id: 'claude', name: 'Claude', provider: 'Anthropic', avatar: '🔮', color: '#a37ede' },
    { id: 'llama', name: 'Llama-2', provider: 'Meta', avatar: '🦙', color: '#1877f2' },
  ];

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        模型选择
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        选择需要评测的大模型，可以选择多个模型进行对比评测。
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              可用模型
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              {models.map((model) => (
                <Grid item xs={12} sm={6} md={4} key={model.id}>
                  <Card 
                    variant="outlined" 
                    sx={{
                      borderColor: selectedModels.includes(model.id) ? model.color : 'divider',
                      borderWidth: selectedModels.includes(model.id) ? 2 : 1,
                      bgcolor: selectedModels.includes(model.id) ? `${model.color}10` : 'transparent',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: model.color,
                            width: 36, 
                            height: 36,
                            fontSize: '1.2rem',
                            mr: 1,
                          }}
                        >
                          {model.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {model.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {model.provider}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Chip 
                          label={selectedModels.includes(model.id) ? '已选择' : '未选择'} 
                          size="small" 
                          color={selectedModels.includes(model.id) ? 'primary' : 'default'}
                          variant={selectedModels.includes(model.id) ? 'filled' : 'outlined'}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={selectedModels.includes(model.id)} 
                              onChange={() => handleModelToggle(model.id)}
                              color="primary"
                            />
                          }
                          label=""
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              已选模型 ({selectedModels.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {selectedModels.length > 0 ? (
              <List>
                {selectedModels.map((modelId) => {
                  const model = models.find(m => m.id === modelId);
                  if (!model) return null;
                  
                  return (
                    <ListItem key={model.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: model.color }}>{model.avatar}</Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={model.name} 
                        secondary={model.provider} 
                      />
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  请至少选择一个模型进行评测
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={selectedModels.length === 0}
                startIcon={<CompareArrowsIcon />}
                component={RouterLink}
                to="/model-evaluation/config"
              >
                下一步：评测配置
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// 评测配置组件
const EvaluationConfig = () => {
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        评测配置
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        配置评测参数和选择题目集。
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          基本配置
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>评测题目集</InputLabel>
              <Select
                value="general_knowledge"
                label="评测题目集"
              >
                <MenuItem value="general_knowledge">通用知识评测集</MenuItem>
                <MenuItem value="coding_ability">编程能力评测集</MenuItem>
                <MenuItem value="reasoning">逻辑推理评测集</MenuItem>
                <MenuItem value="math">数学能力评测集</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>评测方式</InputLabel>
              <Select
                value="automatic"
                label="评测方式"
              >
                <MenuItem value="automatic">自动评测</MenuItem>
                <MenuItem value="manual">人工评测</MenuItem>
                <MenuItem value="hybrid">混合评测</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            component={RouterLink}
            to="/model-evaluation/results"
          >
            开始评测
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

// 评测结果组件
const EvaluationResults = () => {
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        评测结果
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        查看模型评测结果和详细分析。
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">评测概览</Typography>
          <Chip label="评测完成" color="success" />
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              GPT-4
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flexGrow: 1, mr: 1 }}>
                <LinearProgress variant="determinate" value={92} color="success" sx={{ height: 10, borderRadius: 5 }} />
              </Box>
              <Typography variant="body2" color="text.secondary">92分</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              回答准确率: 94% | 推理能力: 90% | 知识覆盖: 92%
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              ChatGLM
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flexGrow: 1, mr: 1 }}>
                <LinearProgress variant="determinate" value={85} color="primary" sx={{ height: 10, borderRadius: 5 }} />
              </Box>
              <Typography variant="body2" color="text.secondary">85分</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              回答准确率: 87% | 推理能力: 82% | 知识覆盖: 86%
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<BarChartIcon />}
          >
            查看详细分析
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

// 主模型评测页面
const ModelEvaluationPage = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);

  // 根据路径设置当前标签页
  useState(() => {
    if (location.pathname.includes('/config')) {
      setTabValue(1);
    } else if (location.pathname.includes('/results')) {
      setTabValue(2);
    } else {
      setTabValue(0);
    }
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        模型评测
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label="模型选择"
            component={RouterLink}
            to="/model-evaluation/select"
            icon={<CompareArrowsIcon />}
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab
            label="评测配置"
            component={RouterLink}
            to="/model-evaluation/config"
            icon={<SettingsIcon />}
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab
            label="评测结果"
            component={RouterLink}
            to="/model-evaluation/results"
            icon={<BarChartIcon />}
            iconPosition="start"
            sx={{ py: 2 }}
          />
        </Tabs>
      </Paper>

      <Routes>
        <Route path="/" element={<ModelSelection />} />
        <Route path="/select" element={<ModelSelection />} />
        <Route path="/config" element={<EvaluationConfig />} />
        <Route path="/results" element={<EvaluationResults />} />
      </Routes>
    </Box>
  );
};

export default ModelEvaluationPage;
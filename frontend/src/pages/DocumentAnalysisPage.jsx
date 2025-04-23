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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  TextField,
  LinearProgress,
  Chip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizIcon from '@mui/icons-material/Quiz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArticleIcon from '@mui/icons-material/Article';

// 文档上传组件
const DocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [recentDocuments, setRecentDocuments] = useState([
    { id: 1, name: '大模型评测指南.pdf', type: 'pdf', size: '2.4 MB', date: '2023-06-15' },
    { id: 2, name: '人工智能伦理白皮书.docx', type: 'docx', size: '1.8 MB', date: '2023-06-10' },
    { id: 3, name: '模型评测标准.txt', type: 'txt', size: '0.5 MB', date: '2023-06-05' },
  ]);

  const handleUpload = () => {
    setUploading(true);
    // 模拟上传过程
    setTimeout(() => {
      setUploading(false);
      // 这里将来会添加新上传的文档到列表
    }, 2000);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PictureAsPdfIcon color="error" />;
      case 'docx':
        return <InsertDriveFileIcon color="primary" />;
      case 'txt':
        return <ArticleIcon color="success" />;
      default:
        return <DescriptionIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        文档上传
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        上传文档以进行内容解析和题目生成。
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed',
              borderColor: 'primary.light',
              borderRadius: 2,
              bgcolor: 'background.paper',
              minHeight: '300px',
              position: 'relative',
            }}
          >
            {uploading && (
              <Box sx={{ width: '100%', position: 'absolute', top: 0, left: 0 }}>
                <LinearProgress />
              </Box>
            )}
            <UploadFileIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              拖拽文件到此处或点击上传
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              支持PDF、Word、TXT等格式文件
              <br />
              最大文件大小: 10MB
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<UploadFileIcon />}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? '上传中...' : '选择文件'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              最近上传的文档
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List>
              {recentDocuments.map((doc) => (
                <ListItem
                  key={doc.id}
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" aria-label="preview" sx={{ mr: 1 }}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {getFileIcon(doc.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.name}
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {doc.size} • 上传于 {doc.date}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {recentDocuments.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  暂无上传文档
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// 文档预览组件
const DocumentPreview = () => {
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        文档预览
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        预览文档内容，标记重点段落。
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">大模型评测指南.pdf</Typography>
          <Button variant="outlined" size="small" startIcon={<QuizIcon />}>
            生成题目
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: 1, mb: 3 }}>
          <Typography variant="body1" paragraph>
            大模型评测是指对大型语言模型（Large Language Models, LLMs）进行系统性能力评估的过程。随着ChatGPT、GPT-4等大模型的出现，如何客观、全面地评测这些模型的能力成为了一个重要课题。
          </Typography>
          <Typography variant="body1" paragraph sx={{ bgcolor: 'primary.light', p: 1, borderRadius: 1 }}>
            评测大模型通常从以下几个维度进行：知识广度、推理能力、创造力、指令遵循能力、安全性等。每个维度可以设计不同的测试题目和评分标准。
          </Typography>
          <Typography variant="body1" paragraph>
            为了确保评测的客观性，通常需要设计多样化的题目，覆盖不同领域和难度级别。同时，评测结果应当可量化，便于不同模型之间的横向比较。
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="text" startIcon={<DescriptionIcon />}>
            查看完整文档
          </Button>
          <Button variant="contained" color="primary" startIcon={<QuizIcon />}>
            从标记段落生成题目
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

// 拆解结果组件
const DocumentResults = () => {
  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>
        拆解结果
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        查看文档拆解结果和生成的题目。
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">拆解结果</Typography>
          <Chip icon={<CheckCircleIcon />} label="拆解完成" color="success" />
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          文档：大模型评测指南.pdf
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          已生成 15 道题目，包含 8 道选择题，5 道判断题，2 道简答题
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    选择题 #1
                  </Typography>
                  <Chip label="中等" size="small" color="primary" variant="outlined" />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                  评测大模型通常从哪些维度进行？
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    A. 代码行数、运行速度、内存占用
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    B. 硬件要求、训练成本、部署难度
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, bgcolor: 'success.light', p: 1, borderRadius: 1 }}>
                    C. 知识广度、推理能力、创造力、指令遵循能力、安全性
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    D. 用户数量、市场份额、商业价值
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    判断题 #1
                  </Typography>
                  <Chip label="简单" size="small" color="success" variant="outlined" />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                  评测大模型时，只需关注模型的知识广度，无需考虑其他能力。
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip label="正确" size="small" variant="outlined" />
                  <Chip label="错误" size="small" color="error" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="outlined" sx={{ mr: 1 }}>
            导出题目
          </Button>
          <Button variant="contained" color="primary">
            添加到题库
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

// 主文档拆解页面
const DocumentAnalysisPage = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);

  // 根据路径设置当前标签页
  useState(() => {
    if (location.pathname.includes('/preview')) {
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
        文档拆解
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
            label="文档上传"
            component={RouterLink}
            to="/document-analysis/upload"
            icon={<UploadFileIcon />}
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab
            label="文档预览"
            component={RouterLink}
            to="/document-analysis/preview"
            icon={<VisibilityIcon />}
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab
            label="拆解结果"
            component={RouterLink}
            to="/document-analysis/results"
            icon={<QuizIcon />}
            iconPosition="start"
            sx={{ py: 2 }}
          />
        </Tabs>
      </Paper>

      <Routes>
        <Route path="/" element={<DocumentUpload />} />
        <Route path="/upload" element={<DocumentUpload />} />
        <Route path="/preview" element={<DocumentPreview />} />
        <Route path="/results" element={<DocumentResults />} />
      </Routes>
    </Box>
  );
};

export default DocumentAnalysisPage;
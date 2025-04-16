import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 页面组件将在这里导入
// import HomePage from './pages/HomePage';
// import QuestionGenerationPage from './pages/QuestionGenerationPage';
// import ModelEvaluationPage from './pages/ModelEvaluationPage';
// import DocumentAnalysisPage from './pages/DocumentAnalysisPage';
// import DataManagementPage from './pages/DataManagementPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<div>大模型评测平台首页</div>} />
          <Route path="/question-generation" element={<div>题目生成模块</div>} />
          <Route path="/model-evaluation" element={<div>模型评测模块</div>} />
          <Route path="/document-analysis" element={<div>文档拆解模块</div>} />
          <Route path="/data-management" element={<div>数据管理与格式转换模块</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
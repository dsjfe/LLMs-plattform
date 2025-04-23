import { useLocation } from 'react-router-dom';
import {
  Drawer as MuiDrawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';

const Drawer = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const location = useLocation();

  const mainMenuItems = [
    { name: '首页', icon: <DashboardIcon />, path: '/' },
    { name: '题目生成', icon: <QuizIcon />, path: '/question-generation' },
    { name: '模型评测', icon: <AssessmentIcon />, path: '/model-evaluation' },
    { name: '文档拆解', icon: <DescriptionIcon />, path: '/document-analysis' },
    { name: '数据管理', icon: <StorageIcon />, path: '/data-management' },
  ];

  // 根据当前路径获取二级菜单
  const getSubMenuItems = (path) => {
    switch (path) {
      case '/':
        return [
          { name: '平台概览', path: '/' },
          { name: '最近评测', path: '/recent-evaluations' },
        ];
      case '/question-generation':
        return [
          { name: '提示词生成', path: '/question-generation/prompt' },
          { name: '文档拆解生成', path: '/question-generation/document' },
        ];
      case '/model-evaluation':
        return [
          { name: '模型选择', path: '/model-evaluation/select' },
          { name: '评测配置', path: '/model-evaluation/config' },
          { name: '评测结果', path: '/model-evaluation/results' },
        ];
      case '/document-analysis':
        return [
          { name: '文档上传', path: '/document-analysis/upload' },
          { name: '文档预览', path: '/document-analysis/preview' },
          { name: '拆解结果', path: '/document-analysis/results' },
        ];
      case '/data-management':
        return [
          { name: '题目管理', path: '/data-management/questions' },
          { name: '评测结果管理', path: '/data-management/results' },
          { name: '格式转换', path: '/data-management/conversion' },
        ];
      default:
        return [];
    }
  };

  // 获取当前路径的主菜单项
  const getCurrentMainPath = () => {
    const currentPath = location.pathname;
    const mainPath = mainMenuItems.find((item) => 
      currentPath === item.path || currentPath.startsWith(`${item.path}/`)
    );
    return mainPath ? mainPath.path : '/';
  };

  const currentMainPath = getCurrentMainPath();
  const subMenuItems = getSubMenuItems(currentMainPath);

  const drawer = (
    <div>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          大模型评测平台
        </Typography>
      </Box>
      <Divider />
      <List>
        {mainMenuItems.map((item) => {
          const isSelected = currentMainPath === item.path;
          return (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isSelected}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isSelected ? 'bold' : 'normal',
                      color: isSelected ? 'primary.main' : 'inherit',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      {subMenuItems.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
            {mainMenuItems.find(item => item.path === currentMainPath)?.name || ''} 子功能
          </Typography>
          <List>
            {subMenuItems.map((item) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItem key={item.name} disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to={item.path}
                    selected={isSelected}
                    sx={{
                      pl: 4,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      },
                    }}
                  >
                    <ListItemText 
                      primary={item.name} 
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: isSelected ? 'bold' : 'normal',
                          color: isSelected ? 'primary.main' : 'inherit',
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </>
      )}
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="navigation drawer"
    >
      {/* 移动端抽屉 */}
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // 提高移动端性能
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </MuiDrawer>
      {/* 桌面端抽屉 */}
      <MuiDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </MuiDrawer>
    </Box>
  );
};

export default Drawer;
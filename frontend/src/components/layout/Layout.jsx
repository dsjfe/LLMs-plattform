import { useState } from 'react';
import { Box, Toolbar, Container } from '@mui/material';
import AppBar from './AppBar';
import Drawer from './Drawer';
import Footer from './Footer';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <AppBar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
      <Drawer
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar /> {/* 为AppBar腾出空间 */}
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 2 }}>
          {children}
        </Container>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
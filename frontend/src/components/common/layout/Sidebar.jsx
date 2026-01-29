import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  Typography
} from '@mui/material';
import {
  Dashboard,
  Description,
  Upload,
  People,
  Category,
  Settings,
  BarChart
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission, user } = useAuth();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
      permission: 'dashboard.view'
    },
    {
      text: 'รายงานทั้งหมด',
      icon: <Description />,
      path: '/reports',
      permission: 'report.read'
    },
    {
      text: 'อัปโหลดรายงาน',
      icon: <Upload />,
      path: '/reports/upload',
      permission: 'report.upload'
    },
    {
      text: 'ผู้ใช้งาน',
      icon: <People />,
      path: '/users',
      permission: 'user.read'
    },
    {
      text: 'หมวดหมู่',
      icon: <Category />,
      path: '/categories',
      permission: 'category.read'
    },
    {
      text: 'สถิติ',
      icon: <BarChart />,
      path: '/statistics',
      permission: 'dashboard.statistics'
    },
    {
      text: 'ตั้งค่า',
      icon: <Settings />,
      path: '/settings',
      permission: 'settings.view'
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            Report System
          </Typography>
          <Typography variant="caption" color="text.secondary">
            v1.0.0
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          if (item.permission && !hasPermission(item.permission)) {
            return null;
          }

          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="caption" color="text.secondary">
          Logged in as:
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {user?.username}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.roles?.map(r => r.name).join(', ')}
        </Typography>
      </Box>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth 
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth 
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
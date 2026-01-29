import { useQuery } from 'react-query';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Description,
  People,
  Download,
  Storage,
  TrendingUp
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { data: stats, isLoading: statsLoading } = useQuery('dashboard-stats', () =>
    api.get('/dashboard/stats')
  );

  const { data: popularReports } = useQuery('popular-reports', () =>
    api.get('/dashboard/popular-reports?limit=5')
  );

  const { data: recentReports } = useQuery('recent-reports', () =>
    api.get('/dashboard/recent-reports?limit=5')
  );

  const { data: categoriesData } = useQuery('reports-by-category', () =>
    api.get('/dashboard/reports-by-category')
  );

  if (statsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const chartData = categoriesData?.data?.map(item => ({
    name: item.category?.name || 'ไม่ระบุ',
    จำนวน: parseInt(item.count)
  })) || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        ภาพรวมการใช้งานระบบ
      </Typography>

      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="รายงานทั้งหมด"
            value={stats?.data?.totalReports || 0}
            icon={<Description sx={{ fontSize: 40, color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="ผู้ใช้งาน"
            value={stats?.data?.totalUsers || 0}
            icon={<People sx={{ fontSize: 40, color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="ดาวน์โหลดวันนี้"
            value={stats?.data?.todayDownloads || 0}
            icon={<Download sx={{ fontSize: 40, color: 'warning.main' }} />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="พื้นที่ใช้งาน"
            value={`${stats?.data?.storageUsedGB || 0} GB`}
            icon={<Storage sx={{ fontSize: 40, color: 'info.main' }} />}
            color="info"
          />
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              รายงานตามหมวดหมู่
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="จำนวน" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Popular Reports */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6">
                รายงานยอดนิยม
              </Typography>
            </Box>
            <List>
              {popularReports?.data?.slice(0, 5).map((report, index) => (
                <ListItem key={report.id} divider>
                  <ListItemText
                    primary={
                      <Typography variant="body2" noWrap>
                        {index + 1}. {report.title}
                      </Typography>
                    }
                    secondary={
                      <Chip
                        label={`${report.download_count} ดาวน์โหลด`}
                        size="small"
                        color="primary"
                        sx={{ mt: 0.5 }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Reports */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              รายงานล่าสุด
            </Typography>
            <List>
              {recentReports?.data?.map((report) => (
                <ListItem key={report.id} divider>
                  <ListItemText
                    primary={report.title}
                    secondary={
                      <Box component="span" display="flex" gap={1} mt={0.5}>
                        <Chip
                          label={report.category?.name || 'ไม่ระบุ'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={new Date(report.created_at).toLocaleDateString('th-TH')}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`โดย ${report.creator?.username || 'Unknown'}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
const db = require('../config/db');

// Get dashboard metrics
const getDashboardMetrics = async (req, res) => {
  try {
    // Get counts from all tables
    const [
      usersResult,
      driversResult,
      vehiclesResult,
      servicesResult,
      towRequestsResult,
      tenantsResult,
      activeRequestsResult,
      completedRequestsResult,
      totalRevenueResult,
      averageRatingResult
    ] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM users WHERE is_active = true'),
      db.query('SELECT COUNT(*) as count FROM drivers WHERE is_active = true'),
      db.query('SELECT COUNT(*) as count FROM vehicles WHERE is_active = true'),
      db.query('SELECT COUNT(*) as count FROM services WHERE is_active = true'),
      db.query('SELECT COUNT(*) as count FROM tow_requests'),
      db.query('SELECT COUNT(*) as count FROM tenants WHERE is_active = true'),
      db.query('SELECT COUNT(*) as count FROM tow_requests WHERE status IN (\'pending\', \'assigned\', \'in_progress\')'),
      db.query('SELECT COUNT(*) as count FROM tow_requests WHERE status = \'completed\''),
      db.query('SELECT COALESCE(SUM(total_price), 0) as total FROM tow_requests WHERE status = \'completed\''),
      db.query('SELECT COALESCE(AVG(score), 0) as average FROM ratings')
    ]);

    // Get status breakdown for requests
    const statusBreakdown = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM tow_requests 
      GROUP BY status
    `);

    // Get revenue by month (last 6 months)
    const revenueByMonth = await db.query(`
      SELECT 
        DATE_TRUNC('month', completed_at) as month,
        SUM(total_price) as revenue,
        COUNT(*) as requests
      FROM tow_requests 
      WHERE status = 'completed' 
        AND completed_at >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', completed_at)
      ORDER BY month DESC
    `);

    // Get top drivers by completed requests
    const topDrivers = await db.query(`
      SELECT 
        d.full_name,
        COUNT(tr.id) as completed_requests,
        AVG(r.score) as average_rating
      FROM drivers d
      LEFT JOIN tow_requests tr ON d.id = tr.driver_id AND tr.status = 'completed'
      LEFT JOIN ratings r ON tr.id = r.request_id
      WHERE d.is_active = true
      GROUP BY d.id, d.full_name
      ORDER BY completed_requests DESC
      LIMIT 5
    `);

    const metrics = {
      totals: {
        users: parseInt(usersResult.rows[0].count),
        drivers: parseInt(driversResult.rows[0].count),
        vehicles: parseInt(vehiclesResult.rows[0].count),
        services: parseInt(servicesResult.rows[0].count),
        towRequests: parseInt(towRequestsResult.rows[0].count),
        tenants: parseInt(tenantsResult.rows[0].count),
        activeRequests: parseInt(activeRequestsResult.rows[0].count),
        completedRequests: parseInt(completedRequestsResult.rows[0].count),
        totalRevenue: parseFloat(totalRevenueResult.rows[0].total),
        averageRating: parseFloat(averageRatingResult.rows[0].average).toFixed(1)
      },
      statusBreakdown: statusBreakdown.rows.map(row => ({
        status: row.status,
        count: parseInt(row.count)
      })),
      revenueByMonth: revenueByMonth.rows.map(row => ({
        month: row.month,
        revenue: parseFloat(row.revenue),
        requests: parseInt(row.requests)
      })),
      topDrivers: topDrivers.rows.map(row => ({
        name: row.full_name,
        completedRequests: parseInt(row.completed_requests),
        averageRating: row.average_rating ? parseFloat(row.average_rating).toFixed(1) : 'N/A'
      }))
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error getting dashboard metrics:', error);
    res.status(500).json({ error: 'Error al obtener métricas del dashboard' });
  }
};

module.exports = {
  getDashboardMetrics
};

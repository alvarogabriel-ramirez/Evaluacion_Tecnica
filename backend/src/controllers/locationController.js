import pool from '../config/database.js';

export const getLocations = async (req, res, next) => {
  try {
    const { company_id } = req.query;
    
    let query = `
      SELECT l.id, l.name, l.address, l.company_id, c.name as company_name 
      FROM locations l
      INNER JOIN companies c ON l.company_id = c.id
    `;
    const params = [];
    
    if (company_id) {
      query += ' WHERE l.company_id = ?';
      params.push(company_id);
    }
    
    query += ' ORDER BY l.name';
    
    const [rows] = await pool.query(query, params);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

export const getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT l.id, l.name, l.address, l.company_id, c.name as company_name 
       FROM locations l
       INNER JOIN companies c ON l.company_id = c.id
       WHERE l.id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

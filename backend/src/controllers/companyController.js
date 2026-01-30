import pool from '../config/database.js';

export const getCompanies = async (req, res, next) => {
  try {
    const { country_id } = req.query;
    
    let query = `
      SELECT c.id, c.name, c.country_id, co.name as country_name 
      FROM companies c
      INNER JOIN countries co ON c.country_id = co.id
    `;
    const params = [];
    
    if (country_id) {
      query += ' WHERE c.country_id = ?';
      params.push(country_id);
    }
    
    query += ' ORDER BY c.name';
    
    const [rows] = await pool.query(query, params);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.country_id, co.name as country_name 
       FROM companies c
       INNER JOIN countries co ON c.country_id = co.id
       WHERE c.id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
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

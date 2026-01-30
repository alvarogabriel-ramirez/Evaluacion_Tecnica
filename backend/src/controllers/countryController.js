import pool from '../config/database.js';

export const getCountries = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, code FROM countries ORDER BY name'
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

export const getCountryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, name, code FROM countries WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Country not found'
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

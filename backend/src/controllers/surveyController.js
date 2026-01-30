import pool from '../config/database.js';

export const getSurveys = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, is_active FROM surveys WHERE is_active = true ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

export const getSurveyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get survey
    const [surveyRows] = await pool.query(
      'SELECT id, title, description, is_active FROM surveys WHERE id = ?',
      [id]
    );
    
    if (surveyRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }
    
    // Get questions
    const [questionRows] = await pool.query(
      'SELECT id, question_text, question_type, options, order_index, is_required FROM questions WHERE survey_id = ? ORDER BY order_index',
      [id]
    );
    
    const survey = {
      ...surveyRows[0],
      questions: questionRows.map(q => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : null
      }))
    };
    
    res.json({
      success: true,
      data: survey
    });
  } catch (error) {
    next(error);
  }
};

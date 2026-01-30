import pool from '../config/database.js';
import { Parser } from 'json2csv';

export const submitSurveyResponse = async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    const { survey_id, country_id, company_id, location_id, answers } = req.body;
    
    // Validation
    if (!survey_id || !country_id || !company_id || !location_id || !answers) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Answers must be a non-empty array'
      });
    }
    
    // Start transaction
    await connection.beginTransaction();
    
    // Insert survey response
    const [result] = await connection.query(
      'INSERT INTO survey_responses (survey_id, country_id, company_id, location_id) VALUES (?, ?, ?, ?)',
      [survey_id, country_id, company_id, location_id]
    );
    
    const responseId = result.insertId;
    
    // Insert answers
    for (const answer of answers) {
      await connection.query(
        'INSERT INTO answers (response_id, question_id, answer_value) VALUES (?, ?, ?)',
        [responseId, answer.question_id, String(answer.answer_value)]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: 'Survey response submitted successfully',
      data: { response_id: responseId }
    });
    
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

export const getSurveyResponses = async (req, res, next) => {
  try {
    const { survey_id, country_id, company_id, location_id } = req.query;
    
    let query = `
      SELECT 
        sr.id,
        sr.survey_id,
        s.title as survey_title,
        sr.country_id,
        co.name as country_name,
        sr.company_id,
        c.name as company_name,
        sr.location_id,
        l.name as location_name,
        sr.submitted_at
      FROM survey_responses sr
      INNER JOIN surveys s ON sr.survey_id = s.id
      INNER JOIN countries co ON sr.country_id = co.id
      INNER JOIN companies c ON sr.company_id = c.id
      INNER JOIN locations l ON sr.location_id = l.id
      WHERE 1=1
    `;
    const params = [];
    
    if (survey_id) {
      query += ' AND sr.survey_id = ?';
      params.push(survey_id);
    }
    if (country_id) {
      query += ' AND sr.country_id = ?';
      params.push(country_id);
    }
    if (company_id) {
      query += ' AND sr.company_id = ?';
      params.push(company_id);
    }
    if (location_id) {
      query += ' AND sr.location_id = ?';
      params.push(location_id);
    }
    
    query += ' ORDER BY sr.submitted_at DESC';
    
    const [rows] = await pool.query(query, params);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

export const getSurveyResponseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get response info
    const [responseRows] = await pool.query(`
      SELECT 
        sr.id,
        sr.survey_id,
        s.title as survey_title,
        sr.country_id,
        co.name as country_name,
        sr.company_id,
        c.name as company_name,
        sr.location_id,
        l.name as location_name,
        sr.submitted_at
      FROM survey_responses sr
      INNER JOIN surveys s ON sr.survey_id = s.id
      INNER JOIN countries co ON sr.country_id = co.id
      INNER JOIN companies c ON sr.company_id = c.id
      INNER JOIN locations l ON sr.location_id = l.id
      WHERE sr.id = ?
    `, [id]);
    
    if (responseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Survey response not found'
      });
    }
    
    // Get answers
    const [answerRows] = await pool.query(`
      SELECT 
        a.id,
        a.question_id,
        q.question_text,
        q.question_type,
        a.answer_value
      FROM answers a
      INNER JOIN questions q ON a.question_id = q.id
      WHERE a.response_id = ?
      ORDER BY q.order_index
    `, [id]);
    
    const response = {
      ...responseRows[0],
      answers: answerRows
    };
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
};

export const exportSurveyResponses = async (req, res, next) => {
  try {
    const { survey_id } = req.query;
    
    if (!survey_id) {
      return res.status(400).json({
        success: false,
        message: 'survey_id is required'
      });
    }
    
    // Get all responses with answers
    const [rows] = await pool.query(`
      SELECT 
        sr.id as response_id,
        s.title as survey_title,
        co.name as country,
        c.name as company,
        l.name as location,
        sr.submitted_at,
        q.question_text,
        q.question_type,
        a.answer_value
      FROM survey_responses sr
      INNER JOIN surveys s ON sr.survey_id = s.id
      INNER JOIN countries co ON sr.country_id = co.id
      INNER JOIN companies c ON sr.company_id = c.id
      INNER JOIN locations l ON sr.location_id = l.id
      INNER JOIN answers a ON a.response_id = sr.id
      INNER JOIN questions q ON a.question_id = q.id
      WHERE sr.survey_id = ?
      ORDER BY sr.submitted_at DESC, q.order_index
    `, [survey_id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No responses found'
      });
    }
    
    // Convert to CSV
    const fields = ['response_id', 'survey_title', 'country', 'company', 'location', 'submitted_at', 'question_text', 'answer_value'];
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);
    
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="survey_responses_${survey_id}_${Date.now()}.csv"`);
    res.send(csv);
    
  } catch (error) {
    next(error);
  }
};

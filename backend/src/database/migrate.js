import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createDatabase = async () => {
  try {
    // Connect without database to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password'
    });

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'survey_system'}`);
    console.log('  Database created/verified');

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'survey_system'}`);

    // Create tables
    console.log('  Creating tables...');

    // Countries table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        code VARCHAR(3) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('    Countries table created');

    // Companies table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        country_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
      )
    `);
    console.log('    Companies table created');

    // Locations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        address VARCHAR(300),
        company_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);
    console.log('    Locations table created');

    // Surveys table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS surveys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('    Surveys table created');

    // Questions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        survey_id INT NOT NULL,
        question_text TEXT NOT NULL,
        question_type ENUM('rating', 'text', 'yes_no', 'multiple_choice') NOT NULL,
        options JSON DEFAULT NULL,
        order_index INT NOT NULL,
        is_required BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
      )
    `);
    console.log('    Questions table created');

    // Survey responses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS survey_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        survey_id INT NOT NULL,
        country_id INT NOT NULL,
        company_id INT NOT NULL,
        location_id INT NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
        FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
        FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
      )
    `);
    console.log('    Survey responses table created');

    // Answers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        response_id INT NOT NULL,
        question_id INT NOT NULL,
        answer_value TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (response_id) REFERENCES survey_responses(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
      )
    `);
    console.log('    Answers table created');

    // Insert sample data
    console.log('\n Inserting sample data...');

    // Countries
    await connection.query(`
      INSERT IGNORE INTO countries (name, code) VALUES 
      ('Guatemala', 'GT'),
      ('El Salvador', 'SV'),
      ('Honduras', 'HN'),
      ('México', 'MX'),
      ('Costa Rica', 'CR')
    `);
    console.log('    Countries inserted');

    // Companies
    await connection.query(`
      INSERT IGNORE INTO companies (name, country_id) VALUES 
      ('CarWash Express GT', 1),
      ('AutoLimpio', 1),
      ('Lavado Premium', 2),
      ('Clean Car Services', 4)
    `);
    console.log('    Companies inserted');

    // Locations
    await connection.query(`
      INSERT IGNORE INTO locations (name, address, company_id) VALUES 
      ('Zona 10', 'Boulevard Los Próceres, Zona 10', 1),
      ('Zona 4', 'Avenida Petapa, Zona 4', 1),
      ('Carretera a El Salvador', 'Km 15.5 Carretera a El Salvador', 2),
      ('San Salvador Centro', 'Col. Escalón, San Salvador', 3),
      ('Ciudad de México - Roma', 'Col. Roma Norte, CDMX', 4)
    `);
    console.log('    Locations inserted');

    // Default Survey
    await connection.query(`
      INSERT INTO surveys (title, description) VALUES 
      ('Encuesta de Satisfacción - Servicio de Lavado', 'Queremos conocer tu opinión sobre el servicio recibido')
    `);
    console.log('    Default survey created');

    // Questions
    await connection.query(`
      INSERT INTO questions (survey_id, question_text, question_type, options, order_index, is_required) VALUES 
      (1, '¿Cómo calificarías la calidad del lavado?', 'rating', '{"min": 1, "max": 5}', 1, true),
      (1, '¿El personal fue amable y profesional?', 'yes_no', NULL, 2, true),
      (1, '¿Qué tan satisfecho estás con el tiempo de espera?', 'rating', '{"min": 1, "max": 5}', 3, true),
      (1, '¿Recomendarías nuestro servicio?', 'yes_no', NULL, 4, true),
      (1, 'Comentarios adicionales (opcional)', 'text', NULL, 5, false)
    `);
    console.log('    Questions inserted');

    console.log('\n  Migration completed successfully!');
    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('  Migration failed:', error.message);
    process.exit(1);
  }
};

createDatabase();

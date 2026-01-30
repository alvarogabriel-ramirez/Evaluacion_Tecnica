import express from 'express';
import { getCountries, getCountryById } from '../controllers/countryController.js';
import { getCompanies, getCompanyById } from '../controllers/companyController.js';
import { getLocations, getLocationById } from '../controllers/locationController.js';
import { getSurveys, getSurveyById } from '../controllers/surveyController.js';
import { 
  submitSurveyResponse, 
  getSurveyResponses, 
  getSurveyResponseById,
  exportSurveyResponses 
} from '../controllers/responseController.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Countries routes
router.get('/countries', getCountries);
router.get('/countries/:id', getCountryById);

// Companies routes
router.get('/companies', getCompanies);
router.get('/companies/:id', getCompanyById);

// Locations routes
router.get('/locations', getLocations);
router.get('/locations/:id', getLocationById);

// Surveys routes
router.get('/surveys', getSurveys);
router.get('/surveys/:id', getSurveyById);

// Survey responses routes
router.post('/responses', submitSurveyResponse);
router.get('/responses', getSurveyResponses);
router.get('/responses/:id', getSurveyResponseById);
router.get('/responses/export/csv', exportSurveyResponses);

export default router;

import React, { useState, useEffect } from 'react';
import { ClipboardList, Building2, MapPin, Globe } from 'lucide-react';
import { surveyService } from '../services/surveyService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

const SurveyPage = () => {
  // State for selections
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // State for data
  const [countries, setCountries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [survey, setSurvey] = useState(null);
  
  // State for answers
  const [answers, setAnswers] = useState({});
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: selection, 2: survey, 3: success
  
  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);
  
  // Load companies when country changes
  useEffect(() => {
    if (selectedCountry) {
      loadCompanies(selectedCountry);
      setSelectedCompany('');
      setSelectedLocation('');
      setCompanies([]);
      setLocations([]);
    }
  }, [selectedCountry]);
  
  // Load locations when company changes
  useEffect(() => {
    if (selectedCompany) {
      loadLocations(selectedCompany);
      setSelectedLocation('');
      setLocations([]);
    }
  }, [selectedCompany]);
  
  const loadCountries = async () => {
    try {
      setLoading(true);
      const response = await surveyService.getCountries();
      setCountries(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los países. Por favor, intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const loadCompanies = async (countryId) => {
    try {
      setLoading(true);
      const response = await surveyService.getCompaniesByCountry(countryId);
      setCompanies(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar las empresas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const loadLocations = async (companyId) => {
    try {
      setLoading(true);
      const response = await surveyService.getLocationsByCompany(companyId);
      setLocations(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar las sedes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const loadSurvey = async () => {
    try {
      setLoading(true);
      const response = await surveyService.getSurveyById(1); // Default survey
      setSurvey(response.data);
      setStep(2);
      setError('');
    } catch (err) {
      setError('Error al cargar la encuesta.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStartSurvey = () => {
    if (!selectedCountry || !selectedCompany || !selectedLocation) {
      setError('Por favor, complete todos los campos antes de continuar.');
      return;
    }
    loadSurvey();
  };
  
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSubmitSurvey = async () => {
    try {
      // Validate required questions
      const requiredQuestions = survey.questions.filter(q => q.is_required);
      const missingAnswers = requiredQuestions.filter(q => !answers[q.id] || answers[q.id] === '');
      
      if (missingAnswers.length > 0) {
        setError('Por favor, responda todas las preguntas obligatorias.');
        return;
      }
      
      setLoading(true);
      setError('');
      
      const payload = {
        survey_id: survey.id,
        country_id: parseInt(selectedCountry),
        company_id: parseInt(selectedCompany),
        location_id: parseInt(selectedLocation),
        answers: Object.entries(answers).map(([questionId, value]) => ({
          question_id: parseInt(questionId),
          answer_value: value
        }))
      };
      
      await surveyService.submitSurveyResponse(payload);
      setSuccess(true);
      setStep(3);
      
    } catch (err) {
      setError('Error al enviar las respuestas. Por favor, intente nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setSelectedCountry('');
    setSelectedCompany('');
    setSelectedLocation('');
    setAnswers({});
    setSurvey(null);
    setSuccess(false);
    setError('');
    setStep(1);
  };
  
  const renderQuestion = (question) => {
    const value = answers[question.id] || '';
    
    switch (question.question_type) {
      case 'rating':
        const max = question.options?.max || 5;
        return (
          <div className="flex gap-2">
            {[...Array(max)].map((_, index) => {
              const rating = index + 1;
              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleAnswerChange(question.id, rating.toString())}
                  className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                    value === rating.toString()
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                  }`}
                >
                  {rating}
                </button>
              );
            })}
          </div>
        );
      
      case 'yes_no':
        return (
          <div className="flex gap-3">
            {['Sí', 'No'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswerChange(question.id, option)}
                className={`px-8 py-3 rounded-lg border-2 font-medium transition-all ${
                  value === option
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );
      
      case 'text':
        return (
          <textarea
            value={value}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="input min-h-[100px] resize-none"
            placeholder="Escriba su respuesta aquí..."
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <ClipboardList className="w-8 h-8 text-white" />
          </div> */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Encuestas
          </h1>
          <p className="text-gray-600">
            {step === 1 && 'Seleccione su ubicación para comenzar'}
            {step === 2 && 'Complete la encuesta de satisfacción'}
            {step === 3 && '¡Gracias por su tiempo!'}
          </p>
        </div>
        
        {/* Step 1: Location Selection */}
        {step === 1 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Ubicación</h2>
            
            {error && (
              <div className="mb-4">
                <ErrorMessage message={error} onRetry={loadCountries} />
              </div>
            )}
            
            {loading ? (
              <Loading />
            ) : (
              <div className="space-y-5">
                {/* Country Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4" />
                    País *
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="input"
                  >
                    <option value="">Seleccione un país</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Company Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4" />
                    Empresa *
                  </label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="input"
                    disabled={!selectedCountry}
                  >
                    <option value="">Seleccione una empresa</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Location Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4" />
                    Sede *
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="input"
                    disabled={!selectedCompany}
                  >
                    <option value="">Seleccione una sede</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} {location.address && `- ${location.address}`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleStartSurvey}
                  disabled={!selectedCountry || !selectedCompany || !selectedLocation}
                  className="w-full btn btn-primary py-3"
                >
                  Continuar a la Encuesta
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Step 2: Survey Questions */}
        {step === 2 && survey && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-2">{survey.title}</h2>
            {survey.description && (
              <p className="text-gray-600 mb-6">{survey.description}</p>
            )}
            
            {error && (
              <div className="mb-4">
                <ErrorMessage message={error} />
              </div>
            )}
            
            <div className="space-y-6">
              {survey.questions.map((question, index) => (
                <div key={question.id} className="pb-6 border-b border-gray-200 last:border-0">
                  <label className="block text-gray-900 font-medium mb-3">
                    {index + 1}. {question.question_text}
                    {question.is_required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleReset}
                className="btn btn-secondary flex-1"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitSurvey}
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Respuestas'}
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Success */}
        {step === 3 && success && (
          <div>
            <SuccessMessage
              message="¡Su encuesta ha sido enviada exitosamente! Gracias por tomarse el tiempo para compartir su opinión."
              onClose={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyPage;

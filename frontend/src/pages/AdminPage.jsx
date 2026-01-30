import React, { useState, useEffect } from 'react';
import { Download, Eye, BarChart3 } from 'lucide-react';
import { surveyService } from '../services/surveyService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const AdminPage = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  
  useEffect(() => {
    loadResponses();
  }, []);
  
  const loadResponses = async () => {
    try {
      setLoading(true);
      const response = await surveyService.getSurveyResponses();
      setResponses(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar las respuestas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await surveyService.exportResponses(1); // Default survey ID
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `encuestas_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err) {
      setError('Error al exportar las respuestas.');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Panel de Administración
                </h1>
              </div>
              <p className="text-gray-600">Visualice y exporte las respuestas de las encuestas</p>
            </div>
            
            <button
              onClick={handleExport}
              disabled={exporting || responses.length === 0}
              className="btn btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exportando...' : 'Exportar CSV'}
            </button>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Respuestas</p>
            <p className="text-3xl font-bold text-primary-600">{responses.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Países</p>
            <p className="text-3xl font-bold text-primary-600">
              {new Set(responses.map(r => r.country_id)).size}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Empresas</p>
            <p className="text-3xl font-bold text-primary-600">
              {new Set(responses.map(r => r.company_id)).size}
            </p>
          </div>
        </div>
        
        {/* Responses List */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Respuestas Recientes</h2>
          
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} onRetry={loadResponses} />
            </div>
          )}
          
          {loading ? (
            <Loading />
          ) : responses.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay respuestas disponibles</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">País</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Empresa</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Sede</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => (
                    <tr key={response.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">#{response.id}</td>
                      <td className="py-3 px-4 text-gray-700">{response.country_name}</td>
                      <td className="py-3 px-4 text-gray-700">{response.company_name}</td>
                      <td className="py-3 px-4 text-gray-700">{response.location_name}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(response.submitted_at).toLocaleString('es-GT')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="card bg-red-50 border-red-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-1">Error</h3>
          <p className="text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 btn btn-secondary text-sm"
            >
              Intentar nuevamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;

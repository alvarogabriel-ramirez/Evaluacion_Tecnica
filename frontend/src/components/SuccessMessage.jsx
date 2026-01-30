import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessMessage = ({ message, onClose }) => {
  return (
    <div className="card bg-green-50 border-green-200">
      <div className="flex items-start gap-3">
        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-green-900 mb-1">¡Éxito!</h3>
          <p className="text-green-700">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="mt-3 btn btn-primary text-sm"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;

// components/chatbot/QuickActions.jsx
import React from 'react';
import { QUICK_ACTIONS } from '../../utils/constants';

const QuickActions = ({ onQuickAction }) => {
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-600 mb-2">Quick Actions:</p>
      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action, index) => (
          <button
            key={index}
            onClick={() => onQuickAction(action.action, action.text)}
            className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors border border-blue-200 hover:border-blue-300"
          >
            {action.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
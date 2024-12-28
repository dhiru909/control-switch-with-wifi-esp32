import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface SwitchProps {
  id: number;
  isOn: boolean;
  onToggle: (id: number) => void;
}

const Switch: React.FC<SwitchProps> = ({ id, isOn, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(id)}
      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 
        rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full 
        bg-gray-100 dark:bg-gray-700">
        {isOn ? (
          <ToggleRight className="w-8 h-8 text-green-500" />
        ) : (
          <ToggleLeft className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <div className="text-left">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          Relay {id}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Status: {isOn ? 'ON' : 'OFF'}
        </p>
      </div>
    </button>
  );
};

export default Switch;
import { useState } from 'react';
import Switch from './components/Switch';
import { ThemeToggle } from './components/ThemeToggle';
import { Power } from 'lucide-react';

function App() {
  const [switches, setSwitches] = useState([
    { id: 1, isOn: false },
    { id: 2, isOn: false },
    { id: 3, isOn: false },
    { id: 4, isOn: false },
  ]);

  const handleToggle = async (id: number) => {
    try {
      const switch_ = switches.find(s => s.id === id);
      const newStatus = !switch_?.isOn;
      const response = await fetch(
        `http://localhost:3000/api/relay/${id}/${newStatus ? 'ON' : 'OFF'}`
      );
      
      if (response.ok) {
        setSwitches(prev =>
          prev.map(s =>
            s.id === id ? { ...s, isOn: newStatus } : s
          )
        );
      } else {
        console.error('Failed to toggle switch');
      }
    } catch (error) {
      console.error('Error toggling switch:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Power className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Switch Control
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Control your Switches with ease
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {switches.map((switch_) => (
            <Switch
              key={switch_.id}
              id={switch_.id}
              isOn={switch_.isOn}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
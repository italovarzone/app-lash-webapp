'use client';

import Sidebar from '../components/Sidebar';
import Anamnese from '../components/Anamnese';

const AnamnesePage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Ficha de Anamnese</h1>
        <Anamnese />
      </main>
    </div>
  );
};

export default AnamnesePage;

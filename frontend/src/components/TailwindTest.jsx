import React from 'react'

const TailwindTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎉 Tailwind CSS is Working!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your Tailwind CSS setup is complete and ready to use.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-500 text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Primary Card</h3>
              <p className="text-blue-100">This card uses blue colors</p>
            </div>
            
            <div className="bg-green-500 text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Success Card</h3>
              <p className="text-green-100">This card uses green colors</p>
            </div>
            
            <div className="bg-purple-500 text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Purple Card</h3>
              <p className="text-purple-100">This card uses purple colors</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Utility Classes Demo</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors">
                Hover Effect
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded transition-colors">
                Another Button
              </button>
            </div>
            <p className="text-gray-300">
              This demonstrates responsive design, hover effects, and various utility classes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TailwindTest 
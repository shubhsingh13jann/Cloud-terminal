function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          ☁️ Cloud Terminal
        </h1>
        <p className="text-green-400 font-mono text-lg">
          Tailwind v4 is working ✅
        </p>
        <div className="mt-6 bg-gray-800 rounded-lg p-4 font-mono">
          <span className="text-green-400">user@cloud</span>
          <span className="text-white">:~$ </span>
          <span className="text-yellow-300">npm run dev</span>
        </div>
      </div>
    </div>
  )
}

export default App
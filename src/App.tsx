function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-100">
            {/* Минималистичный логотип RentBox - стилизованная коробка */}
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="16" width="32" height="24" rx="2" stroke="black" strokeWidth="4"/>
              <path d="M8 16L24 8L40 16" stroke="black" strokeWidth="4" strokeLinejoin="round"/>
              <line x1="24" y1="8" x2="24" y2="40" stroke="black" strokeWidth="4"/>
            </svg>
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
          RentBox
        </h1>

        {/* Tagline */}
        <p className="text-lg text-slate-500 mb-10">
          Аренда оборудования
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-slate-100 mb-12">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="text-slate-700 font-medium">Скоро открытие</span>
        </div>

        {/* Contact */}
        <div className="space-y-2 text-slate-400">
          <p>info@rentbox.az</p>
          <p className="text-slate-600 font-medium">+994 55 766 14 06</p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-slate-300 text-sm">
        © 2025 RentBox · Баку
      </div>
    </div>
  )
}

export default App

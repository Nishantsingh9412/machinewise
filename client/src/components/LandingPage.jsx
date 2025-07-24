import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">MachineWise</div>
          <Link
            to="/dashboard"
            className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Go to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="inline-block bg-blue-700 text-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Industrial IoT Solutions
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Smart Factory
              <span className="text-blue-300"> Monitoring</span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Real-time machine health monitoring with intelligent alerts and
              predictive analytics. Keep your industrial operations running
              smoothly with our advanced IoT dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/dashboard"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center cursor-pointer"
              >
                View Live Dashboard
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <button
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors cursor-pointer"
                onClick={() =>  window.open("https://machinewise.in/","_blank")}
              >
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-300">99.9%</div>
                <div className="text-blue-100">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-300">24/7</div>
                <div className="text-blue-100">Monitoring</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-300">5sec</div>
                <div className="text-blue-100">Real-time Updates</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Live Machine Status
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-green-600 font-semibold mb-1">
                      Temperature
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      72.3°C
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-blue-600 font-semibold mb-1">
                      Vibration
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      15.2 mm/s
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-purple-600 font-semibold mb-1">
                      Current
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                      12.8 A
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="text-orange-600 font-semibold mb-1">
                      Voltage
                    </div>
                    <div className="text-2xl font-bold text-orange-700">
                      240 V
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">System Status:</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Healthy
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/dashboard"
                  className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center"
                >
                  View Full Dashboard
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg">
              <div className="text-sm font-semibold">Live Data</div>
              <div className="text-xs opacity-90">Updated every 5s</div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
              <div className="text-sm font-semibold">All Systems</div>
              <div className="text-xs opacity-90">Operational</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose MachineWise?
          </h2>
          <p className="text-blue-100 text-lg">
            Advanced features for comprehensive industrial monitoring
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Real-time Monitoring
            </h3>
            <p className="text-blue-100">
              Continuous sensor data collection with 5-second refresh intervals
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Smart Alerts
            </h3>
            <p className="text-blue-100">
              Intelligent threshold monitoring with immediate notifications
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Predictive Analytics
            </h3>
            <p className="text-blue-100">
              Advanced status logic for proactive maintenance planning
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t border-blue-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white text-lg font-semibold mb-4 md:mb-0">
              MachineWise
            </div>
            <div className="text-blue-100 text-sm">
              © 2025 MachineWise. Industrial IoT Solutions for Smart
              Manufacturing.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

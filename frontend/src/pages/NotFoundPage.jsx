import { Link } from 'react-router-dom'
import { ROUTES } from '../utils/constants.js'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center font-mono">
        <p className="text-green-400 text-6xl mb-4">404</p>
        <h1 className="text-white text-2xl font-bold mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          The route you are looking for does not exist
        </p>
        <div className="bg-gray-800 rounded-lg p-4 text-left mb-6 text-sm">
          <span className="text-green-400">$ </span>
          <span className="text-white">cd </span>
          <Link
            to={ROUTES.TERMINAL}
            className="text-blue-400 hover:underline"
          >
            /terminal
          </Link>
        </div>
        <Link
          to={ROUTES.TERMINAL}
          className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Go to Terminal
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
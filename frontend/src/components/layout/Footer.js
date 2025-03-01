import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white">AI Interviewer</h3>
            <p className="mt-2 text-gray-400">Practice makes perfect. Ace your next interview with AI-powered feedback.</p>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-white">Navigation</h4>
            <ul className="mt-2 space-y-2">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white">Register</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-white">Resources</h4>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="#" className="hover:text-white">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">FAQ</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Support</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p>&copy; {new Date().getFullYear()} AI Interviewer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

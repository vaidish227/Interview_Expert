import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>AI Interviewer</h3>
            <p>Practice makes perfect. Ace your next interview with AI-powered feedback.</p>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h4>Navigation</h4>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Resources</h4>
              <ul>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">Support</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AI Interviewer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


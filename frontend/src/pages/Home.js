import { Link } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>AI-Powered Interview Practice</h1>
              <p>
                Upload your resume, answer a few questions, and get personalized interview practice with AI feedback.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2>How It Works</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-file-upload"></i>
                </div>
                <h3>Upload Resume</h3>
                <p>Upload your resume and provide information about your target role.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-microphone"></i>
                </div>
                <h3>Voice Interview</h3>
                <p>Answer questions verbally for a realistic interview experience.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Get Feedback</h3>
                <p>Receive detailed analysis and suggestions to improve your answers.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2>Ready to Ace Your Next Interview?</h2>
            <p>Practice makes perfect. Start your AI interview session today.</p>
            <Link to="/register" className="btn btn-primary">
              Start Now
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home


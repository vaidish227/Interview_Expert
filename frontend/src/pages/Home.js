import { Link } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

const Home = () => {
  return (
    <div className="home-page bg-light-color text-dark-color">
      <Navbar />

      <main>
        <section className="hero bg-primary-light-color text-dark-color py-16">
          <div className="container mx-auto px-4">
            <div className="hero-content text-center max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">AI-Powered Interview Practice</h1>
              <p className="text-lg mb-6">
                Upload your resume, answer a few questions, and get personalized interview practice with AI feedback.
              </p>
              <div className="hero-buttons flex justify-center gap-4">
                <Link to="/register" className="btn btn-primary bg-success-light-color hover:bg-success-dark-color px-6 py-3 rounded-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline border border-dark-color px-6 py-3 rounded-lg hover:bg-dark-color hover:text-light-color">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="features py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="features-grid grid gap-8 md:grid-cols-3">
              <div className="feature-card bg-white p-6 rounded-lg shadow">
                <div className="feature-icon text-3xl mb-4 text-primary-color">
                  <i className="fas fa-file-upload"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
                <p>Upload your resume and provide information about your target role.</p>
              </div>

              <div className="feature-card bg-white p-6 rounded-lg shadow">
                <div className="feature-icon text-3xl mb-4 text-primary-color">
                  <i className="fas fa-microphone"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Voice Interview</h3>
                <p>Answer questions verbally for a realistic interview experience.</p>
              </div>

              <div className="feature-card bg-white p-6 rounded-lg shadow">
                <div className="feature-icon text-3xl mb-4 text-primary-color">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Feedback</h3>
                <p>Receive detailed analysis and suggestions to improve your answers.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta bg-info-light-color text-dark-color py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
            <p className="mb-6">Practice makes perfect. Start your AI interview session today.</p>
            <Link to="/register" className="btn btn-primary bg-warning-light-color hover:bg-warning-dark-color px-6 py-3 rounded-lg">
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


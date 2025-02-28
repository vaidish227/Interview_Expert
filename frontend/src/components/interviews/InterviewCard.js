import { Link } from "react-router-dom"

const InterviewCard = ({ interview }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <span className="badge badge-success">Completed</span>
      case "in-progress":
        return <span className="badge badge-warning">In Progress</span>
      default:
        return <span className="badge badge-info">Pending</span>
    }
  }

  return (
    <div className="interview-card">
      <div className="interview-card-header">
        <h3>{interview.userInputs.targetRole}</h3>
        {getStatusBadge(interview.status)}
      </div>

      <div className="interview-card-content">
        <p>
          <strong>Industry:</strong> {interview.userInputs.industryFocus}
        </p>
        <p>
          <strong>Created:</strong> {formatDate(interview.createdAt)}
        </p>
        <p>
          <strong>Questions:</strong> {interview.questions.length}
        </p>
      </div>

      <div className="interview-card-footer">
        {interview.status === "completed" ? (
          <Link to={`/interview/${interview._id}/report`} className="btn btn-primary btn-sm">
            View Report
          </Link>
        ) : (
          <Link to={`/interview/${interview._id}`} className="btn btn-primary btn-sm">
            {interview.status === "pending" ? "Start Interview" : "Continue Interview"}
          </Link>
        )}
      </div>
    </div>
  )
}

export default InterviewCard


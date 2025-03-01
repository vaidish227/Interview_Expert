import { Link } from "react-router-dom"

const InterviewCard = ({ interview }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <span className="px-2 py-1 text-sm font-semibold text-green-800 bg-green-200 rounded-full">Completed</span>
      case "in-progress":
        return <span className="px-2 py-1 text-sm font-semibold text-yellow-800 bg-yellow-200 rounded-full">In Progress</span>
      default:
        return <span className="px-2 py-1 text-sm font-semibold text-blue-800 bg-blue-200 rounded-full">Pending</span>
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{interview.userInputs.targetRole}</h3>
        {getStatusBadge(interview.status)}
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          <strong className="text-gray-800">Industry:</strong> {interview.userInputs.industryFocus}
        </p>
        <p className="text-gray-600">
          <strong className="text-gray-800">Created:</strong> {formatDate(interview.createdAt)}
        </p>
        <p className="text-gray-600">
          <strong className="text-gray-800">Questions:</strong> {interview.questions.length}
        </p>
      </div>

      <div className="flex justify-end">
        {interview.status === "completed" ? (
          <Link to={`/interview/${interview._id}/report`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            View Report
          </Link>
        ) : (
          <Link to={`/interview/${interview._id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {interview.status === "pending" ? "Start Interview" : "Continue Interview"}
          </Link>
        )}
      </div>
    </div>
  )
}

export default InterviewCard

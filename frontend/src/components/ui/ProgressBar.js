const ProgressBar = ({ value }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${value}%` }}></div>
    </div>
  )
}

export default ProgressBar


const Alert = ({ type, message }) => {
  return (
    <div className={`alert alert-${type}`}>
      {type === "error" && <i className="fas fa-exclamation-circle"></i>}
      {type === "success" && <i className="fas fa-check-circle"></i>}
      {type === "info" && <i className="fas fa-info-circle"></i>}
      <span>{message}</span>
    </div>
  )
}

export default Alert


import "./Toast.css";

export default function Toast({ message, type = "success", onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">
        {type === "success" ? "✓" : "!"}
      </span>

      <span className="toast-message">
        {message}
      </span>

      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
} 
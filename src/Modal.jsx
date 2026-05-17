export default function Modal({ 
  isOpen, 
  title, 
  onClose, 
  onConfirm, 
  confirmText = "Uložit", 
  cancelText = "Zrušit",
  type = "alert", 
  children 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        
        {children}

        <div className="modal-actions">
          {type !== 'alert' && (
            <button className="btn btn-secondary" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button 
            className={type === 'danger' ? "btn btn-danger" : "btn"} 
            onClick={type === 'alert' ? onClose : onConfirm}
          >
            {type === 'alert' ? 'OK' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

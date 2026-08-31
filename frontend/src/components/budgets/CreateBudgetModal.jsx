export default function CreateBudgetModal({ show, onClose, onCreate }) {
  if (!show) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={e=>e.stopPropagation()} onSubmit={onCreate}>
        <h3>Create Budget</h3>
        <select name="category"><option>Food</option><option>Transport</option><option>Shopping</option><option>Bills</option></select>
        <input name="limit" placeholder="Monthly Limit" type="number" required />
        <button type="submit" className="primary-btn">Create Budget</button>
      </form>
    </div>
  )
}

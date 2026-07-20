import { useState } from 'react'

const categories = [
  'Food', 'Bills', 'Transport', 'Shopping',
  'Entertainment', 'Travel', 'Other',
]

export default function ExpenseForm({ onAdd }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [touched, setTouched] = useState({})

  const errors = {}
  if (touched.amount && !amount) errors.amount = 'Required'
  if (touched.amount && amount && parseFloat(amount) <= 0) errors.amount = 'Must be positive'
  if (touched.date && !date) errors.date = 'Required'

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ amount: true, date: true })
    if (!amount || !date || parseFloat(amount) <= 0) return
    onAdd({
      amount: parseFloat(amount),
      category,
      description: description || null,
      date,
    })
    setAmount('')
    setCategory('Food')
    setDescription('')
    setDate(new Date().toISOString().slice(0, 10))
    setTouched({})
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>
      <div className="form-row">
        <div className="field-wrap">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, amount: true }))}
            className={errors.amount ? 'input-error' : ''}
          />
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="field-wrap">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, date: true }))}
            className={errors.date ? 'input-error' : ''}
          />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

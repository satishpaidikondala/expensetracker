const API = '/expenses'

function authHeaders() {
  const t = localStorage.getItem('token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

export async function fetchExpenses() {
  const res = await fetch(API, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to fetch expenses')
  return res.json()
}
export async function createExpense(expense) {
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(expense) })
  if (!res.ok) throw new Error('Failed to add expense')
  return res.json()
}
export async function deleteExpense(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed to delete')
}
export async function fetchCategorySummary() {
  const res = await fetch(`${API}/summary/by-category`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
export async function fetchMonthlySummary(year) {
  const res = await fetch(`${API}/summary/monthly?year=${year}`, { headers: { ...authHeaders() } })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}
export async function parseExpense(text) {
  const res = await fetch(`${API}/parse`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ text }) })
  if (!res.ok) throw new Error('Failed to parse')
  return res.json()
}

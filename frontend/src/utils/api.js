const BASE_URL = '/api'

export async function fetchRecipes({ page = 1, limit = 15 } = {}) {
  const url = `${BASE_URL}/recipes?page=${page}&limit=${limit}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch recipes')
  return res.json()
}

export async function searchRecipes({ title, cuisine, calories, total_time, rating, page = 1, limit = 15 } = {}) {
  const params = new URLSearchParams()
  if (title) params.set('title', title)
  if (cuisine) params.set('cuisine', cuisine)
  if (calories) params.set('calories', calories)
  if (total_time) params.set('total_time', total_time)
  if (rating) params.set('rating', rating)
  params.set('page', page)
  params.set('limit', limit)
  const url = `${BASE_URL}/recipes/search?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to search recipes')
  return res.json()
}

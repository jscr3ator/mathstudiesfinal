export default async function handler(req, res) {
  // Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Simple counter increment using Upstash KV (free on Vercel)
    // For now, we'll use a simple approach with a file-based counter
    
    // Get current count from environment or start at 0
    let count = parseInt(process.env.VIEW_COUNT || '0') + 1
    
    // In production, you'd store this in a database
    // For now, returning incremented value
    // Each deployment resets, so we'll use a timestamp-based approach
    
    const today = new Date().toISOString().split('T')[0]
    const stored = JSON.parse(process.env.STORAG || '{}')
    
    if (stored.date !== today) {
      stored.date = today
      stored.count = 1
    } else {
      stored.count = (stored.count || 0) + 1
    }
    
    res.status(200).json({
      value: stored.count,
      date: today
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ value: 0, error: 'Server error' })
  }
}

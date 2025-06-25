import { db } from 'src/firestore'

export default async function handler(req, res) {
  const { method } = req

  const wallet = req.query.wallet || req.body.wallet
  if (!wallet) {
    return res.status(400).json({ error: 'Missing wallet' })
  }

  const ref = db.collection('WalletPoints').doc(wallet)
  const snapshot = await ref.get()

  try {
    if (method === 'GET') {
      const points = snapshot.exists ? snapshot.data()?.points || 0 : 0

      return res.status(200).json({ points })
    }

    if (method === 'POST') {
      const { txHash, txUrl, points } = req.body
      if (!txHash) {
        return res.status(400).json({ error: 'Missing Transaction Hash' })
      }

      if (!wallet || !txUrl || typeof points !== 'number') {
        return res.status(400).json({ error: 'Invalid request data' })
      }

      const ref = db.collection('WalletTransactions').doc(txHash)
      const snapshot = await ref.get()

      if (snapshot.exists) {
        return res.status(400).json({ error: 'Invalid transaction' })
      }

      await addTransaction(wallet, txHash, txUrl, points)
      await updatePoints(wallet, points)

      return res.status(200).json({ success: true })
    }

    res.setHeader('Allow', ['get', 'POST'])
    return res.status(405).end(`Method ${method} Not Allowed`)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

const addTransaction = async (wallet, txHash, txUrl, points) => {
  const ref = db.collection('WalletTransactions').doc(txHash)
  await ref.set({ wallet, txUrl, points, timestamp: new Date() })
}

const updatePoints = async (wallet, points) => {
  const ref = db.collection('WalletPoints').doc(wallet)
  const snapshot = await ref.get()

  const currentPoints = snapshot.data()?.points || 0
  await ref.set({ points: currentPoints + points })
}

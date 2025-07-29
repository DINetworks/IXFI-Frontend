// lib/firebase-admin.ts
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import path from 'path'
import { readFileSync } from 'fs'

const serviceAccountPath = path.resolve(process.cwd(), 'src/firestore/serviceAccount.json') // adjust path as needed

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApp()

export const db = getFirestore(app)

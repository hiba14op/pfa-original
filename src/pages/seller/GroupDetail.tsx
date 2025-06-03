// src/pages/seller/GroupDetail.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

interface GroupData {
  orderId: number
  productName: string
  description: string
  category: string
  originalPrice: number
  minGroupSize: number
  maxGroupSize: number
  endDate: string
  features: string[]
  pricing: { rangeLabel: string, price: number }[]
}

export default function GroupDetail() {
  const { id } = useParams()
  const [groupData, setGroupData] = useState<GroupData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/seller/group/${id}/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setGroupData(res.data)
      } catch (err) {
        console.error("Erreur chargement détails groupe :", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [id])

  if (loading) return <div className="p-4">Chargement...</div>
  if (!groupData) return <div className="p-4 text-red-500">Groupe introuvable</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{groupData.productName}</h1>
      <p className="mb-2"><strong>Catégorie :</strong> {groupData.category}</p>
      <p className="mb-2"><strong>Description :</strong> {groupData.description}</p>
      <p className="mb-2"><strong>Prix de référence :</strong> {groupData.originalPrice} €</p>
      <p className="mb-2"><strong>Taille du groupe :</strong> {groupData.minGroupSize} - {groupData.maxGroupSize} personnes</p>
      <p className="mb-2"><strong>Date limite :</strong> {groupData.endDate}</p>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Caractéristiques :</h2>
        <ul className="list-disc pl-6">
          {groupData.features.map((feat, index) => (
            <li key={index}>{feat}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Tarification progressive :</h2>
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Plage</th>
              <th className="border px-4 py-2">Prix (€)</th>
            </tr>
          </thead>
          <tbody>
            {groupData.pricing.map((tier, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{tier.rangeLabel}</td>
                <td className="border px-4 py-2">{tier.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

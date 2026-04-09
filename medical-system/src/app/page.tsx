'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'

export default function Home() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDevices() {
      const { data, error } = await supabase.from('Devices').select('*')
      if (!error) setDevices(data)
      setLoading(false)
    }
    fetchDevices()
  }, [])

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">جاري تحميل النظام...</div>

  return (
    <main className="min-h-screen bg-[#0f172a] p-8 text-white font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">نظام الغويدي للهندسة الطبية</h1>
            <p className="text-slate-400 mt-2 text-lg">لوحة تحكم الأجهزة والمعدات</p>
          </div>
          <div className="bg-blue-600/20 p-4 rounded-2xl border border-blue-500/30">
            <span className="text-blue-400 font-bold ml-2">إجمالي الأجهزة:</span>
            <span className="text-2xl font-black">{devices.length}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div key={device.id} className="bg-[#1e293b] rounded-[2rem] p-6 border border-slate-700 hover:border-blue-500 transition-all shadow-xl group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-800 p-3 rounded-2xl group-hover:bg-blue-600 transition-colors">
                  🏥
                </div>
                <div className="bg-white p-2 rounded-xl">
                  {/* هنا التعديل السحري: الرابط الجديد الخاص بك على Vercel */}
                  <QRCodeSVG 
                    value={`https://medical-system-mauve.vercel.app/device/${device.id}`} 
                    size={80}
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-1">{device.name_of_device}</h2>
              <p className="text-blue-400 text-sm mb-4">{device.department}</p>

              <div className="space-y-2 border-t border-slate-700 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">الموديل:</span>
                  <span className="font-mono">{device.model || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">حالة الصيانة:</span>
                  <span className="text-emerald-400 font-bold">{device.Status_of_Device}</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-slate-800 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-all">
                طباعة الملصق الذكي
              </button>
            </div>
          ))}
        </div>

        <footer className="mt-20 text-center text-slate-500 border-t border-slate-800 pt-8">
          نظام إدارة المعدات الطبية | تطوير المهندس <span className="text-blue-500 font-bold text-lg">إبراهيم الغويدي</span>
        </footer>
      </div>
    </main>
  )
}
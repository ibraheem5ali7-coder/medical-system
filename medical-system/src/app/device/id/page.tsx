'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function DeviceDetails() {
  // التعديل لضمان التوافق مع Vercel
  const params = useParams() as { id: string }
  const [device, setDevice] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getDeviceData() {
      const { data, error } = await supabase
        .from('Devices')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (!error) setDevice(data)
      setLoading(false)
    }
    if (params.id) getDeviceData()
  }, [params.id])

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-black">جاري جلب بيانات الجهاز...</div>
  if (!device) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-black">الجهاز غير موجود في النظام!</div>

  return (
    <main className="min-h-screen bg-[#0f172a] p-6 text-slate-200 font-sans" dir="rtl">
      <div className="max-w-md mx-auto bg-[#1e293b] rounded-[2.5rem] p-8 border-2 border-blue-500 shadow-2xl">
        <div className="text-center mb-6">
          <span className="bg-blue-600 text-white p-3 rounded-2xl text-3xl inline-block mb-4">🏥</span>
          <h1 className="text-2xl font-black text-white">{device.name_of_device}</h1>
          <p className="text-blue-400">ملف الجهاز الفني</p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-700">
            <p className="text-xs text-slate-500 mb-1">القسم المختص:</p>
            <p className="text-lg font-bold text-white">{device.department}</p>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-700">
            <p className="text-xs text-slate-500 mb-1">الموديل:</p>
            <p className="text-lg font-bold text-white">{device.model || 'غير مسجل'}</p>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-700">
            <p className="text-xs text-slate-500 mb-1">تاريخ آخر صيانة:</p>
            <p className="text-lg font-bold text-emerald-400">{device.last_maintenance_date || 'لا يوجد سجل'}</p>
          </div>

          <div className={`p-4 rounded-2xl border text-center font-black ${device.Status_of_Device === 'Active' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-rose-500/10 border-rose-500 text-rose-500'}`}>
            حالة الجهاز: {device.Status_of_Device === 'Active' ? 'يعمل بكفاءة' : 'خارج الخدمة / صيانة'}
          </div>
        </div>

        <footer className="mt-8 text-center text-[10px] text-slate-500 border-t border-slate-800 pt-4">
          نظام التحكم الهندسي | تطوير المهندس إبراهيم الغويدي
        </footer>
      </div>
    </main>
  )
}
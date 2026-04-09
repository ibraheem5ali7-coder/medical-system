'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { QRCodeSVG } from 'qrcode.react'

export default function Home() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name_of_device: '',
    department: '',
    model: '',
    Status_of_Device: 'Active'
  })

  // جلب البيانات من Supabase
  const fetchDevices = async () => {
    const { data, error } = await supabase.from('Devices').select('*').order('created_at', { ascending: false })
    if (!error) setDevices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  // وظيفة إضافة جهاز جديد
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('Devices').insert([formData])
    if (!error) {
      setFormData({ name_of_device: '', department: '', model: '', Status_of_Device: 'Active' })
      fetchDevices()
      alert('تم إضافة الجهاز بنجاح!')
    }
  }

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">جاري تحميل النظام...</div>

  return (
    <main className="min-h-screen bg-[#0f172a] p-4 md:p-8 text-white font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* الهيدر */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-slate-800 pb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic">
              نظام الغويدي للهندسة الطبية
            </h1>
            <p className="text-slate-400 mt-2 text-lg">المنصة الذكية لإدارة وتتبع الأجهزة والمعدات</p>
          </div>
          <div className="bg-blue-600/20 p-4 rounded-2xl border border-blue-500/30 flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-blue-300 uppercase tracking-wider">إجمالي الأجهزة</p>
              <p className="text-3xl font-black text-white">{devices.length}</p>
            </div>
            <div className="text-3xl">🚀</div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* نموذج إضافة جهاز جديد - الجانب الأيمن */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e293b] p-6 rounded-[2rem] border border-slate-700 sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="text-blue-500">➕</span> إضافة جهاز جديد
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-1">اسم الجهاز</label>
                  <input 
                    required
                    className="w-full bg-[#0f172a] border border-slate-600 rounded-xl p-3 focus:border-blue-500 outline-none transition-all"
                    value={formData.name_of_device}
                    onChange={(e) => setFormData({...formData, name_of_device: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">القسم</label>
                  <input 
                    required
                    className="w-full bg-[#0f172a] border border-slate-600 rounded-xl p-3 focus:border-blue-500 outline-none"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">الموديل (الرقم التسلسلي)</label>
                  <input 
                    className="w-full bg-[#0f172a] border border-slate-600 rounded-xl p-3 focus:border-blue-500 outline-none"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">حالة الجهاز</label>
                  <select 
                    className="w-full bg-[#0f172a] border border-slate-600 rounded-xl p-3 focus:border-blue-500 outline-none"
                    value={formData.Status_of_Device}
                    onChange={(e) => setFormData({...formData, Status_of_Device: e.target.value})}
                  >
                    <option value="Active">يعمل (Active)</option>
                    <option value="Maintenance">صيانة (Maintenance)</option>
                    <option value="Out of Order">خارج الخدمة</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all mt-4">
                  إضافة الجهاز للنظام
                </button>
              </form>
            </div>
          </div>

          {/* عرض الأجهزة - الجانب الأيسر */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {devices.map((device) => (
              <div key={device.id} className="bg-[#1e293b] rounded-[2.5rem] p-6 border border-slate-700 hover:border-blue-500/50 transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Medical Asset</span>
                    <h2 className="text-2xl font-black">{device.name_of_device}</h2>
                    <p className="text-blue-400 font-medium">{device.department}</p>
                  </div>
                  <div className="bg-white p-2 rounded-2xl shadow-2xl border-4 border-slate-800">
                    <QRCodeSVG 
                      value={`https://medical-system-mauve.vercel.app/device/${device.id}`} 
                      size={90}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 bg-[#0f172a]/50 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">الموديل</p>
                    <p className="font-mono text-sm">{device.model || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">الحالة</p>
                    <p className={`text-sm font-bold ${device.Status_of_Device === 'Active' ? 'text-emerald-400' : 'text-orange-400'}`}>
                      ● {device.Status_of_Device}
                    </p>
                  </div>
                </div>

                <button className="w-full bg-slate-800 hover:bg-blue-600 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]">
                  <span>🖨️</span> طباعة الملصق الذكي
                </button>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-20 text-center text-slate-500 border-t border-slate-800 pt-10 pb-10">
          <p className="text-sm tracking-[0.2em] mb-2 uppercase">Biomedical Engineering System</p>
          <p className="text-lg">تطوير المهندس <span className="text-blue-500 font-black">إبراهيم الغويدي</span> © 2026</p>
        </footer>
      </div>
    </main>
  )
}
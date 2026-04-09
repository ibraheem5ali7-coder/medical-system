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
    Status_of_Device: 'Active',
    last_maintenance: new Date().toISOString().split('T')[0],
    next_maintenance: ''
  })

  const fetchDevices = async () => {
    const { data, error } = await supabase.from('Devices').select('*').order('created_at', { ascending: false })
    if (!error) setDevices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('Devices').insert([formData])
    if (!error) {
      setFormData({ 
        name_of_device: '', department: '', model: '', 
        Status_of_Device: 'Active', last_maintenance: '', next_maintenance: '' 
      })
      fetchDevices()
      alert('تم إضافة الجهاز وسجل الصيانة بنجاح!')
    }
  }

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-sans">جاري مزامنة الأنظمة الحيوية...</div>

  return (
    <main className="min-h-screen bg-[#0f172a] p-4 md:p-8 text-white font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-slate-800 pb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent italic">
              نظام الغويدي للهندسة الطبية
            </h1>
            <p className="text-slate-400 mt-2 text-lg flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              المنصة الذكية لإدارة وتتبع الأجهزة والمعدات
            </p>
          </div>
          <div className="bg-[#1e293b] p-5 rounded-3xl border border-blue-500/30 shadow-2xl shadow-blue-500/10">
            <p className="text-xs text-blue-400 font-bold mb-1 tracking-tighter">TOTAL MEDICAL ASSETS</p>
            <p className="text-4xl font-black">{devices.length < 10 ? `0${devices.length}` : devices.length}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* لوحة الإضافة الذكية */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e293b] p-6 rounded-[2.5rem] border border-slate-700 shadow-xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-blue-400">📝 تسجيل جهاز جديد</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="اسم الجهاز" className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none transition-all" value={formData.name_of_device} onChange={(e) => setFormData({...formData, name_of_device: e.target.value})} />
                <input required placeholder="القسم" className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                <input placeholder="الموديل / الرقم التسلسلي" className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 mr-2">آخر صيانة</label>
                    <input type="date" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-2 text-sm outline-none" value={formData.last_maintenance} onChange={(e) => setFormData({...formData, last_maintenance: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 mr-2">الصيانة القادمة</label>
                    <input type="date" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-2 text-sm outline-none" value={formData.next_maintenance} onChange={(e) => setFormData({...formData, next_maintenance: e.target.value})} />
                  </div>
                </div>

                <select className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 focus:border-blue-500 outline-none appearance-none" value={formData.Status_of_Device} onChange={(e) => setFormData({...formData, Status_of_Device: e.target.value})}>
                  <option value="Active">يعمل بكفاءة (Active)</option>
                  <option value="Maintenance">تحت الصيانة</option>
                  <option value="Out of Order">خارج الخدمة</option>
                </select>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg transition-all transform active:scale-95">إضافة الجهاز للنظام</button>
              </form>
            </div>
          </div>

          {/* عرض البطاقات الاحترافية */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
            {devices.map((device) => (
              <div key={device.id} className="bg-[#1e293b] rounded-[3rem] p-8 border border-slate-800 hover:border-emerald-500/30 transition-all group relative overflow-hidden shadow-2xl">
                {/* تأثير النبض البصري */}
                <div className="absolute top-0 right-0 p-4">
                  <span className={`h-3 w-3 rounded-full block ${device.Status_of_Device === 'Active' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-red-500 animate-pulse'}`}></span>
                </div>

                <div className="flex flex-row-reverse justify-between items-start gap-4">
                  <div className="bg-white p-3 rounded-[2rem] shadow-inner">
                    <QRCodeSVG value={`https://medical-system-mauve.vercel.app/device/${device.id}`} size={100} />
                  </div>
                  <div className="flex-1">
                    <span className="text-blue-400 text-xs font-black tracking-widest block mb-2">BIOMEDICAL ASSET</span>
                    <h2 className="text-3xl font-black mb-1 group-hover:text-blue-400 transition-colors">{device.name_of_device}</h2>
                    <p className="text-slate-400 font-bold mb-4">{device.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-800 pt-6">
                  <div className="bg-[#0f172a]/50 p-3 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-bold">آخر صيانة</p>
                    <p className="text-xs font-mono">{device.last_maintenance || '2026-01-10'}</p>
                  </div>
                  <div className="bg-[#0f172a]/50 p-3 rounded-2xl border-r-2 border-emerald-500">
                    <p className="text-[10px] text-emerald-500 font-bold">موعد الصيانة القادم</p>
                    <p className="text-xs font-mono text-emerald-400">{device.next_maintenance || '2026-07-15'}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                   <div className="text-[10px] font-mono text-slate-600 italic">S/N: {device.model || 'N/A'}</div>
                   <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${device.Status_of_Device === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                     Status: {device.Status_of_Device}
                   </div>
                </div>

                <button className="w-full mt-6 bg-white text-[#0f172a] py-4 rounded-[1.5rem] font-black hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-3">
                  <span>🖨️</span> طباعة الملصق الذكي
                </button>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-20 text-center text-slate-600 border-t border-slate-800 pt-10 pb-10">
          <div className="inline-flex items-center gap-2 mb-4 bg-slate-900 px-6 py-2 rounded-full border border-slate-800">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest uppercase">System Online & Encrypted</span>
          </div>
          <p className="text-xl">تطوير المهندس <span className="text-white font-black">إبراهيم الغويدي</span></p>
        </footer>
      </div>
    </main>
  )
}
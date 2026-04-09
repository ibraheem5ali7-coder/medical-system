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

  // دالة الطباعة التي طلبتها
  const handlePrint = (deviceId: string) => {
    const printContent = document.getElementById(`device-card-${deviceId}`);
    const windowUrl = window.location.href;
    const printWindow = window.open('', '', 'width=600,height=600');
    
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <body dir="rtl" style="font-family: Arial; padding: 20px;">
            <div style="border: 2px solid #000; padding: 20px; border-radius: 15px; text-align: center;">
              ${printContent.innerHTML}
              <style>button { display: none !important; }</style>
            </div>
            <script>window.onload = function() { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('Devices').insert([formData])
    if (!error) {
      setFormData({ name_of_device: '', department: '', model: '', Status_of_Device: 'Active', last_maintenance: '', next_maintenance: '' })
      fetchDevices()
      alert('تمت إضافة الجهاز بنجاح!')
    }
  }

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">جاري مزامنة الأنظمة...</div>

  return (
    <main className="min-h-screen bg-[#0f172a] p-4 md:p-8 text-white font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 border-b border-slate-800 pb-8 text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic">نظام الغويدي للهندسة الطبية</h1>
          <p className="text-slate-400 mt-2">لوحة التحكم الذكية ومتابعة الصيانة الدورية</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-[#1e293b] p-6 rounded-[2rem] border border-slate-700 shadow-xl">
              <h2 className="text-xl font-bold mb-6 text-blue-400">➕ إضافة جهاز</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="اسم الجهاز" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 outline-none" value={formData.name_of_device} onChange={(e) => setFormData({...formData, name_of_device: e.target.value})} />
                <input required placeholder="القسم" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 outline-none" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                <input placeholder="الموديل / Serial Number" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 outline-none" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><label className="text-slate-500">آخر صيانة</label><input type="date" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-2 mt-1" value={formData.last_maintenance} onChange={(e) => setFormData({...formData, last_maintenance: e.target.value})} /></div>
                  <div><label className="text-emerald-500">الصيانة القادمة</label><input type="date" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-2 mt-1" value={formData.next_maintenance} onChange={(e) => setFormData({...formData, next_maintenance: e.target.value})} /></div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold mt-4 transition-all shadow-lg">حفظ البيانات</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {devices.map((device) => (
              <div key={device.id} id={`device-card-${device.id}`} className="bg-[#1e293b] rounded-[2.5rem] p-6 border border-slate-800 relative group transition-all hover:border-blue-500/50">
                <div className="flex justify-between items-start gap-4">
                  <div className="bg-white p-2 rounded-2xl shadow-lg border-2 border-slate-800">
                    {/* تعديل الرابط مؤقتاً لفتح الصفحة الرئيسية في الجوال وتجنب خطأ 404 */}
                    <QRCodeSVG value={`https://medical-system-mauve.vercel.app/`} size={100} />
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-blue-400 text-[10px] font-black tracking-widest block mb-1 underline">BIOMEDICAL ASSET</span>
                    <h2 className="text-2xl font-black">{device.name_of_device}</h2>
                    <p className="text-slate-400 text-sm font-bold">{device.department}</p>
                  </div>
                </div>

                {/* استعادة عرض السيريال والموديل */}
                <div className="mt-6 grid grid-cols-2 gap-4 bg-[#0f172a]/50 p-4 rounded-2xl border border-slate-800">
                  <div className="text-right"><p className="text-[10px] text-slate-500 uppercase">Serial/Model</p><p className="text-sm font-mono">{device.model || 'N/A'}</p></div>
                  <div className="text-right"><p className="text-[10px] text-slate-500 uppercase">Status</p><p className={`text-sm font-bold ${device.Status_of_Device === 'Active' ? 'text-emerald-400' : 'text-orange-400'}`}>● {device.Status_of_Device}</p></div>
                  <div className="text-right"><p className="text-[10px] text-slate-500 uppercase text-blue-400">Last Maint.</p><p className="text-xs">{device.last_maintenance || 'N/A'}</p></div>
                  <div className="text-right"><p className="text-[10px] text-emerald-500 uppercase">Next Maint.</p><p className="text-xs text-emerald-400">{device.next_maintenance || 'N/A'}</p></div>
                </div>

                <button onClick={() => handlePrint(device.id)} className="w-full mt-6 bg-white text-[#0f172a] py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-xl">
                  🖨️ طباعة الملصق الذكي
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
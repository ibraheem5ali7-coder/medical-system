'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'
import { QRCodeSVG } from 'qrcode.react'

export default function Home() {
  const [devices, setDevices] = useState<any[]>([])
  const [name, setName] = useState('')
  const [model, setModel] = useState('')
  const [section, setSection] = useState('')
  const [status, setStatus] = useState('Active')
  const [lastDate, setLastDate] = useState('')
  const [interval, setInterval] = useState('6')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  async function getDevices() {
    const { data, error } = await supabase
      .from('Devices')
      .select('*')
      .order('id', { ascending: false }) 
    if (!error) setDevices(data || [])
  }

  // دالة الطباعة الاحترافية باسم المهندس إبراهيم الغويدي
  const handlePrint = (device: any) => {
    const qrSvg = document.getElementById(`qr-code-${device.id}`);
    const winPrint = window.open('', '', 'width=600,height=700');
    winPrint?.document.write(`
      <html>
        <head>
          <title>طباعة ملصق الجهاز: ${device.name_of_device}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: center; padding: 10px; background: white; }
            .sticker-box { border: 5px solid #0f172a; padding: 25px; display: inline-block; border-radius: 25px; width: 320px; background: #f8fafc; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header-info { border-bottom: 2px solid #e2e8f0; margin-bottom: 15px; padding-bottom: 10px; }
            .app-name { margin: 0; font-size: 16px; font-weight: bold; color: #1e40af; }
            h1 { margin: 10px 0; font-size: 28px; font-weight: black; color: #0f172a; text-decoration: underline; text-decoration-color: #3b82f6; }
            .qr-canvas-container { margin: 25px auto; padding: 10px; background: white; border-radius: 15px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; }
            .device-meta { background: #e0f2fe; padding: 10px; border-radius: 10px; margin-bottom: 15px; }
            .meta-p { margin: 5px 0; font-size: 14px; font-weight: 600; color: #1e3a8a; }
            .designer-credit { font-size: 11px; color: #64748b; margin-top: 15px; padding-top: 10px; border-top: 2px solid #e2e8f0; }
            .designer-name { color: #1e40af; font-weight: bold; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="sticker-box">
            <div class="header-info"><p class="app-name">🏥 نظام التحكم الهندسي الطبي</p></div>
            <p style="text-align: right; color: #94a3b8; font-size: 10px; margin: 0;">اسم الأصل الطبي:</p>
            <h1>${device.name_of_device}</h1>
            <div class="qr-canvas-container"><div id="print-qr-placeholder"></div></div>
            <div class="device-meta">
              <p class="meta-p">⚙️ الموديل: ${device.model || '--'}</p>
              <p class="meta-p">📍 القسم: ${device.department}</p>
              <p class="meta-p">🔢 الرمز: #${device.id}</p>
            </div>
            <p class="designer-credit">هوية رقمية معتمدة عبر نظام الغويدي الذكي<br>المصمم والمطور: <span class="designer-name">المهندس إبراهيم الغويدي</span></p>
          </div>
          <script>
            const originalQrSvg = window.opener.document.getElementById('qr-code-${device.id}');
            if (originalQrSvg) {
              const placeholder = document.getElementById('print-qr-placeholder');
              const clonedSvg = originalQrSvg.cloneNode(true);
              clonedSvg.setAttribute('width', '180'); clonedSvg.setAttribute('height', '180');
              placeholder.appendChild(clonedSvg);
            }
            setTimeout(() => { window.print(); window.close(); }, 800);
          </script>
        </body>
      </html>
    `);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !section || !lastDate) return alert('يرجى ملء البيانات وتاريخ الصيانة')
    const deviceData = { name_of_device: name, model: model, department: section, Status_of_Device: status, last_maintenance_date: lastDate, maintenance_interval: parseInt(interval) }
    if (editingId) {
      await supabase.from('Devices').update(deviceData).eq('id', editingId)
      setEditingId(null); clearForm(); getDevices();
    } else {
      await supabase.from('Devices').insert([{ ...deviceData, serial_number: `SN-${Math.floor(Math.random() * 10000)}` }])
      clearForm(); getDevices();
    }
  }

  const clearForm = () => { setName(''); setModel(''); setSection(''); setStatus('Active'); setLastDate(''); setInterval('6'); setEditingId(null); }

  function startEdit(device: any) {
    setEditingId(device.id); setName(device.name_of_device); setModel(device.model || '');
    setSection(device.department); setStatus(device.Status_of_Device);
    setLastDate(device.last_maintenance_date || ''); setInterval(device.maintenance_interval?.toString() || '6');
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPPMStatus = (lastDateStr: string, intervalMonths: number) => {
    if (!lastDateStr) return { label: 'غير محدد', color: 'text-slate-500' };
    const nextDate = new Date(lastDateStr);
    nextDate.setMonth(nextDate.getMonth() + intervalMonths);
    const diff = Math.ceil((nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: `متأخر (${Math.abs(diff)} يوم)`, color: 'text-rose-500 font-bold animate-pulse' };
    if (diff <= 15) return { label: `قريب (${diff} يوم)`, color: 'text-orange-500 font-bold' };
    return { label: `بعد ${diff} يوم`, color: 'text-emerald-500' };
  }

  useEffect(() => { getDevices() }, [])

  return (
    <main className="min-h-screen bg-[#0f172a] p-6 md:p-10 font-sans text-slate-200" dir="rtl">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <span className="bg-blue-600 p-2 rounded-xl text-2xl">⚙️</span> نظام التحكم الهندسي الطبي
          </h1>
          <p className="text-blue-400/60 mt-1">تطوير المهندس إبراهيم الغويدي</p>
        </div>
      </div>

      <div className={`max-w-6xl mx-auto p-8 rounded-[2rem] mb-10 border transition-all ${editingId ? 'bg-blue-900/20 border-blue-500 shadow-2xl shadow-blue-500/10' : 'bg-[#1e293b] border-slate-700 shadow-lg'}`}>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <input placeholder="اسم الجهاز" value={name} onChange={(e) => setName(e.target.value)} className="bg-[#0f172a] p-3 rounded-xl border border-slate-700 outline-none focus:border-blue-500" />
          <input placeholder="الموديل" value={model} onChange={(e) => setModel(e.target.value)} className="bg-[#0f172a] p-3 rounded-xl border border-slate-700 outline-none focus:border-blue-500" />
          <input placeholder="القسم" value={section} onChange={(e) => setSection(e.target.value)} className="bg-[#0f172a] p-3 rounded-xl border border-slate-700 outline-none focus:border-blue-500" />
          <div className="flex flex-col">
            <label className="text-[10px] text-blue-400 mb-1 font-bold mr-1">تاريخ آخر صيانة</label>
            <input type="date" value={lastDate} onChange={(e) => setLastDate(e.target.value)} className="bg-[#0f172a] p-2 rounded-xl border border-slate-700 outline-none" />
          </div>
          <select value={interval} onChange={(e) => setInterval(e.target.value)} className="bg-[#0f172a] p-3 rounded-xl border border-slate-700 outline-none mt-4">
            <option value="3">كل 3 أشهر</option><option value="6">كل 6 أشهر</option><option value="12">سنوي</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-[#0f172a] p-3 rounded-xl border border-slate-700 outline-none mt-4">
            <option value="Active">يعمل</option><option value="Under Maintenance">تحت الصيانة</option><option value="Out of Order">عطلان</option>
          </select>
          <button type="submit" className="bg-blue-600 rounded-xl font-black text-white hover:bg-blue-500 lg:col-span-6 h-[50px] mt-4 shadow-lg shadow-blue-900/40">
            {editingId ? '✅ تحديث البيانات' : '💾 حفظ الجهاز الجديد'}
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto mb-8 relative">
        <input type="text" placeholder="🔍 ابحث بالاسم أو القسم..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1e293b] p-5 rounded-[1.5rem] border border-slate-700 text-white outline-none focus:border-blue-500" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {devices.filter(d => d.name_of_device?.toLowerCase().includes(searchTerm.toLowerCase())).map((device) => {
          const ppm = getPPMStatus(device.last_maintenance_date, device.maintenance_interval || 6);
          return (
            <div key={device.id} className="bg-[#1e293b] border border-slate-800 p-8 rounded-[2rem] shadow-lg hover:border-blue-500/50 transition-all flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1 w-full text-right">
                <h3 className="text-2xl font-black text-white mb-2">{device.name_of_device}</h3>
                <div className="space-y-1 mb-4">
                  <p className="text-sm">📍 القسم: <span className="text-blue-400 font-bold">{device.department}</span></p>
                  <p className={`text-sm ${ppm.color}`}>🕒 الصيانة: {ppm.label}</p>
                </div>
                <div className="bg-white p-2 rounded-2xl inline-block shadow-xl">
                  <QRCodeSVG 
                    id={`qr-code-${device.id}`}
                    value={typeof window !== 'undefined' ? `${window.location.origin}/device/${device.id}` : ''} 
                    size={90} 
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <button onClick={() => startEdit(device)} className="p-3 bg-slate-800 hover:bg-blue-600 rounded-xl text-xs font-bold transition-all">✏️ تعديل</button>
                <button onClick={() => handlePrint(device)} className="p-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all">🖨️ طباعة الملصق</button>
                <button onClick={async () => { if(confirm("حذف؟")) { await supabase.from('Devices').delete().eq('id', device.id); getDevices(); } }} className="p-3 bg-slate-800 hover:bg-rose-600 rounded-xl text-xs font-bold transition-all">🗑️ حذف</button>
              </div>
            </div>
          );
        })}
      </div>
      <footer className="max-w-6xl mx-auto mt-20 text-center text-slate-500 text-sm border-t border-slate-800 pt-10 pb-10">
        تطوير المهندس <span className="text-blue-500 font-bold">إبراهيم الغويدي</span>
      </footer>
    </main>
  )
}
'use client';

import { useState } from "react";
import { FiSearch,FiX,FiPlus,FiTag,FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useGetAdminCouponsQuery,useCreateCouponMutation,
  useUpdateCouponStatusMutation,useDeleteCouponMutation
} from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";
import ConfirmModal from "@/components/ui/ConfirmModal";

const STYLE={
  فعال:"bg-green-100 text-green-700",
  غیرفعال:"bg-gray-100 text-gray-600",
  "منقضی شده":"bg-red-100 text-red-700"
};

export default function AdminCouponsPage(){
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [showForm,setShowForm]=useState(false);
  const [deleteId,setDeleteId]=useState(null);
  const [form,setForm]=useState({code:"",type:"percent",value:"",maxUses:"",expiresAt:""});
  const {data:coupons=[],isLoading}=useGetAdminCouponsQuery();
  const [create]=useCreateCouponMutation(),[update]=useUpdateCouponStatusMutation(),[remove]=useDeleteCouponMutation();

  const submit=async e=>{
    e.preventDefault();
    if(!form.code.trim()||!form.value||!form.maxUses)return toast.error("کد، مقدار تخفیف و سقف استفاده را وارد کنید");
    try{
      await create(form).unwrap();
      toast.success("کد تخفیف ایجاد شد");
      setForm({code:"",type:"percent",value:"",maxUses:"",expiresAt:""});
      setShowForm(false);
    }catch{toast.error("خطا در ایجاد کد تخفیف")}
  };

  const toggle=async(c)=>{
    try{
      await update({id:c.id,status:c.status==="فعال"?"غیرفعال":"فعال"}).unwrap();
      toast.success("وضعیت کد تخفیف تغییر کرد");
    }catch{toast.error("خطا در تغییر وضعیت")}
  };

  const removeCoupon=async()=>{
    try{await remove(deleteId).unwrap();toast.success("کد تخفیف حذف شد")}
    catch{toast.error("خطا در حذف کد تخفیف")}
    setDeleteId(null);
  };

  const Actions=({c})=>c.status==="منقضی شده"?
    <button onClick={()=>setDeleteId(c.id)} className="p-2 text-gray-400 hover:text-red-600"><FiTrash2/></button>:
    <div className="flex gap-2">
      <button onClick={()=>toggle(c)} className={`px-3 py-2 rounded-xl text-xs text-white ${c.status==="فعال"?"bg-red-500":"bg-green-500"}`}>
        {c.status==="فعال"?"غیرفعال کردن":"فعال کردن"}
      </button>
      <button onClick={()=>setDeleteId(c.id)} className="p-2 text-gray-400 hover:text-red-600"><FiTrash2/></button>
    </div>;

  return <div className="min-h-screen w-full overflow-x-hidden bg-[#F5F7FA] flex" dir="rtl">
    <AdminSidebar activeMenu="coupons" setActiveMenu={()=>{}} menuItems={adminMenuItems} isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)}/>
    <main className="flex-1 min-w-0 lg:mr-64">
      <AdminHeader onMenuClick={()=>setSidebarOpen(true)}/>

      <div className="p-3 sm:p-5 lg:p-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">کدهای تخفیف</h1>
            <p className="text-gray-500 mt-1 text-sm">ایجاد و مدیریت کدهای تخفیف پلتفرم</p>
          </div>
          <button onClick={()=>setShowForm(!showForm)} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm">
            {showForm?<FiX/>:<FiPlus/>}{showForm?"انصراف":"کد تخفیف جدید"}
          </button>
        </header>

        {showForm&&<form onSubmit={submit} className="bg-white rounded-2xl border p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              ["code","کد تخفیف","WELCOME20"],
              ["value",`مقدار ${form.type==="percent"?"(٪)":"(تومان)"}`,""],
              ["maxUses","سقف استفاده",""],
              ["expiresAt","تاریخ انقضا","۱۴۰۵/۰۴/۰۱"]
            ].map(([key,label,placeholder])=><div key={key}>
              <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
              <input
                value={form[key]}
                placeholder={placeholder}
                type={key==="value"||key==="maxUses"?"number":"text"}
                onChange={e=>setForm({...form,[key]:key==="code"?e.target.value.toUpperCase():e.target.value})}
                className="w-full px-3 py-2.5 border rounded-xl text-sm"
                dir={key==="code"?"ltr":"rtl"}
              />
            </div>)}

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">نوع تخفیف</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="w-full px-3 py-2.5 border rounded-xl text-sm bg-white">
                <option value="percent">درصدی</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </div>
          </div>
          <button className="mt-4 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm">ایجاد کد تخفیف</button>
        </form>}

        <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {isLoading?<p className="py-12 text-center text-sm text-gray-400">در حال بارگذاری...</p>:
          !coupons.length?<p className="py-12 text-center text-sm text-gray-400">هنوز کد تخفیفی ثبت نشده</p>:
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50"><tr>{["کد","تخفیف","استفاده","انقضا","وضعیت","عملیات"].map(x=><th key={x} className="p-4 text-right text-sm">{x}</th>)}</tr></thead>
                <tbody>{coupons.map(c=><tr key={c.id} className="border-t">
                  <td className="p-4 font-mono"><FiTag className="inline text-indigo-500 ml-1"/>{c.code}</td>
                  <td className="p-4 text-sm">{c.type==="percent"?`${c.value}٪`:`${c.value.toLocaleString("fa-IR")} تومان`}</td>
                  <td className="p-4 text-sm">{c.usedCount} / {c.maxUses}</td>
                  <td className="p-4 text-sm">{c.expiresAt}</td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs ${STYLE[c.status]}`}>{c.status}</span></td>
                  <td className="p-4"><Actions c={c}/></td>
                </tr>)}</tbody>
              </table>
            </div>

            <div className="md:hidden p-3 space-y-3">
              {coupons.map(c=><div key={c.id} className="p-4 border rounded-2xl shadow-sm">
                <div className="flex justify-between gap-2 mb-4">
                  <div className="font-mono font-medium"><FiTag className="inline text-indigo-500 ml-1"/>{c.code}</div>
                  <span className={`h-fit px-2.5 py-1 rounded-full text-xs ${STYLE[c.status]}`}>{c.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><small className="block text-gray-400">تخفیف</small>{c.type==="percent"?`${c.value}٪`:`${c.value.toLocaleString("fa-IR")} تومان`}</div>
                  <div><small className="block text-gray-400">استفاده</small>{c.usedCount} / {c.maxUses}</div>
                  <div><small className="block text-gray-400">انقضا</small>{c.expiresAt}</div>
                </div>
                <div className="border-t mt-4 pt-4"><Actions c={c}/></div>
              </div>)}
            </div>
          </>}
        </section>
      </div>
    </main>

    <ConfirmModal
      open={!!deleteId}
      title="حذف کد تخفیف"
      description={`آیا مطمئن هستید که می‌خواهید کد تخفیف «${coupons.find(c=>c.id===deleteId)?.code}» را حذف کنید؟`}
      confirmText="حذف"
      onConfirm={removeCoupon}
      onCancel={()=>setDeleteId(null)}
    />
  </div>;
}
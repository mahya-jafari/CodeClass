'use client';

import { useState,useMemo } from "react";
import { FiSearch,FiX,FiTrash2,FiShield,FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useGetAdminUsersQuery,useUpdateUserStatusMutation,useDeleteUserMutation,
  useGetPendingPresentersQuery,useUpdatePresenterApprovalMutation
} from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";
import ConfirmModal from "@/components/ui/ConfirmModal";

const TABS=[["all","همه"],["participant","شرکت‌کننده"],["presenter","ارائه‌دهنده"],["admin","مدیر"]];
const ROLES={participant:"شرکت‌کننده",presenter:"ارائه‌دهنده",admin:"مدیر سیستم"};
const STYLE={فعال:"bg-green-100 text-green-700",غیرفعال:"bg-gray-100 text-gray-600"};

export default function AdminUsersPage(){
  const [sidebarOpen,setSidebarOpen]=useState(false),[search,setSearch]=useState(""),[role,setRole]=useState("all"),[confirm,setConfirm]=useState(null);

  const {data:users=[],isLoading:ul}=useGetAdminUsersQuery();
  const {data:pending=[],isLoading:pl}=useGetPendingPresentersQuery();
  const [updateStatus]=useUpdateUserStatusMutation();
  const [deleteUser]=useDeleteUserMutation();
  const [approval]=useUpdatePresenterApprovalMutation();

  const filter=(arr,roleFilter=false)=>{
    const q=search.toLowerCase().trim();
    return arr.filter(x=>
      (!q||x.name?.toLowerCase().includes(q)||x.email?.toLowerCase().includes(q)) &&
      (!roleFilter||role==="all"||x.role===role)
    );
  };

  const change=async(id,status)=>{
    try{await updateStatus({id,status}).unwrap();toast.success("وضعیت کاربر تغییر کرد")}
    catch{toast.error("خطا در تغییر وضعیت")}
  };

  const approve=async(id,status)=>{
    try{
      await approval({id,approvalStatus:status}).unwrap();
      toast.success(status==="approved"?"ارائه‌دهنده تأیید شد":"درخواست رد شد");
    }catch{toast.error("خطا در تغییر وضعیت")}
  };

  const remove=async()=>{
    try{await deleteUser(confirm.id).unwrap();toast.success("کاربر حذف شد")}
    catch{toast.error("خطا در حذف کاربر")}
    setConfirm(null);
  };

  const Actions=({u})=>{
    if(u.role==="admin") return <span className="text-xs text-gray-400">بدون دسترسی تغییر</span>;
    return <div className="flex gap-2 items-center">
      <button onClick={()=>change(u.id,u.status==="فعال"?"غیرفعال":"فعال")}
        className={`px-3 py-2 rounded-xl text-xs text-white ${u.status==="فعال"?"bg-red-500":"bg-green-500"}`}>
        {u.status==="فعال"?"غیرفعال کردن":"فعال کردن"}
      </button>
      <button onClick={()=>setConfirm({type:"user",id:u.id})} className="p-2 text-gray-400 hover:text-red-600"><FiTrash2/></button>
    </div>
  };

  const UserCard=({u})=>(
    <div className="p-4 border rounded-2xl shadow-sm">
      <div className="flex justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">{u.name?.charAt(0)}</div>
          <div>
            <div className="font-medium text-sm flex items-center gap-1">{u.name}{u.role==="admin"&&<FiShield className="text-indigo-500"/>}</div>
            <div className="text-xs text-gray-500">{ROLES[u.role]||u.role}</div>
          </div>
        </div>
        <span className={`h-fit px-2.5 py-1 rounded-full text-xs ${STYLE[u.status]}`}>{u.status}</span>
      </div>
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div><small className="text-gray-400 ml-2">ایمیل:</small>{u.email}</div>
        <div><small className="text-gray-400 ml-2">تاریخ:</small>{u.date}</div>
      </div>
      <div className="border-t mt-4 pt-4"><Actions u={u}/></div>
    </div>
  );

  return <div className="min-h-screen w-full overflow-x-hidden bg-[#F5F7FA] flex" dir="rtl">
    <AdminSidebar activeMenu="users" setActiveMenu={()=>{}} menuItems={adminMenuItems} isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)}/>
    <main className="flex-1 min-w-0 lg:mr-64">
      <AdminHeader onMenuClick={()=>setSidebarOpen(true)}/>
      <div className="p-3 sm:p-5 lg:p-8">
        <header className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">مدیریت کاربران</h1>
          <p className="text-gray-500 mt-1 text-sm">مدیریت شرکت‌کنندگان، ارائه‌دهندگان و مدیران پلتفرم</p>
        </header>

        <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-3 sm:p-4 border-b space-y-3">
            <div className="relative max-w-md">
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="جستجو بر اساس نام یا ایمیل..." className="w-full pr-10 pl-9 py-2.5 border rounded-xl text-sm outline-none"/>
              {search&&<button onClick={()=>setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2"><FiX/></button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {TABS.map(([k,l])=><button key={k} onClick={()=>setRole(k)} className={`px-3 py-1.5 rounded-full text-xs ${role===k?"bg-blue-600 text-white":"bg-gray-100 text-gray-600"}`}>{l}</button>)}
            </div>
          </div>

          {ul||pl?<p className="py-12 text-center text-sm text-gray-400">در حال بارگذاری...</p>:<>
            <div className="p-3 sm:p-4 border-b">
              <h2 className="font-medium mb-3">کاربران</h2>
              {!filter(users,true).length?<p className="py-6 text-center text-sm text-gray-400">کاربری پیدا نشد</p>:
              <div className="hidden md:block overflow-x-auto"><table className="w-full">
                <thead className="bg-gray-50"><tr>{["نام و نقش","ایمیل","تاریخ عضویت","وضعیت","عملیات"].map(x=><th className="p-4 text-right text-sm" key={x}>{x}</th>)}</tr></thead>
                <tbody>{filter(users,true).map(u=><tr key={u.id} className="border-t">
                  <td className="p-4 font-medium">{u.name}</td><td className="p-4 text-sm">{u.email}</td><td className="p-4 text-sm">{u.date}</td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs ${STYLE[u.status]}`}>{u.status}</span></td>
                  <td className="p-4"><Actions u={u}/></td>
                </tr>)}</tbody>
              </table></div>}
              <div className="md:hidden space-y-3">{filter(users,true).map(u=><UserCard key={u.id} u={u}/>)}</div>
            </div>

            <div className="p-3 sm:p-4">
              <h2 className="font-medium mb-3">ارائه‌دهندگان در انتظار تأیید</h2>
              {!filter(pending).length?<p className="py-6 text-center text-sm text-gray-400">در حال حاضر درخواست در انتظاری وجود ندارد</p>:
              <div className="space-y-3">
                {filter(pending).map(p=><div key={p.id} className="p-4 border rounded-2xl">
                  <div className="flex justify-between gap-3">
                    <div><b>{p.name}</b><div className="text-xs text-gray-500 mt-1">{p.email}</div></div>
                    <div className="flex gap-2">
                      <button onClick={()=>approve(p.id,"approved")} className="px-3 py-2 rounded-xl text-xs bg-green-500 text-white"><FiCheck className="inline"/> تأیید</button>
                      <button onClick={()=>approve(p.id,"rejected")} className="px-3 py-2 rounded-xl text-xs bg-red-50 text-red-600">رد</button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">موبایل: {p.phone} · ثبت‌نام: {p.date}</div>
                </div>)}
              </div>}
            </div>
          </>}
        </section>
      </div>
    </main>

    <ConfirmModal
      open={!!confirm}
      title={confirm?.type==="user"?"حذف کاربر":"رد درخواست"}
      description="آیا مطمئن هستید؟ این عملیات قابل بازگشت نیست."
      confirmText={confirm?.type==="user"?"حذف":"رد درخواست"}
      onConfirm={remove}
      onCancel={()=>setConfirm(null)}
    />
  </div>;
}
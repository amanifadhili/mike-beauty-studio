'use client';

// We create a Client wrapper so we can hold the state of the ServiceModal
import { useState } from 'react';
import { ServiceModal } from '@/components/admin/ServiceModal';
import { toggleServiceStatus, deleteService } from '@/app/actions/adminServices';

type ServiceData = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // PRISMA SCHEMA HAS THIS AS A STRING, not number
  active: boolean;
};

export function ServicesDashboardClient({ initialServices }: { initialServices: ServiceData[] }) {
  const [services] = useState<ServiceData[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceData | null>(null);

  const handleOpenNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: ServiceData) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (serviceId: string, currentStatus: boolean) => {
    const res = await toggleServiceStatus(serviceId, currentStatus);
    if (!res.success) {
      alert("Failed to toggle status");
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service? If there are bookings attached, it will fail.")) {
      const res = await deleteService(serviceId);
      if (!res.success) {
        alert(res.error || "Failed to delete service.");
      }
    }
  };

  return (
    <>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-gold/70 mb-1">Admin Dashboard</p>
          <h1 className="font-playfair text-3xl text-white">Service Catalog</h1>
          <p className="text-gray-600 text-sm font-sans mt-1">Manage pricing, duration, and availability of your treatments.</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-gold text-charcoal px-5 py-2.5 rounded-lg font-sans text-sm tracking-wide hover:bg-[#c9a633] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-[#1a1a1a] border border-white/5 p-6 flex flex-col h-full relative group">
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">
                  Service
                </span>
                <h3 className="font-playfair text-xl text-white">{service.name}</h3>
              </div>
              
              {/* Status Toggle Bubble */}
              <button 
                onClick={() => handleToggleActive(service.id, service.active)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-colors shrink-0 mt-1 ${
                  service.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                }`}
                title={service.active ? "Click to Disable" : "Click to Enable"}
              />
            </div>

            <p className="text-gray-400 text-sm font-sans mb-6 flex-grow">
              {service.description}
            </p>

            <div className="flex justify-between items-end pt-4 border-t border-white/5">
              <div>
                <div className="font-playfair text-lg text-gold">{service.price.toLocaleString()} RWF</div>
                <div className="font-sans text-xs text-gray-500">{service.duration} mins</div>
              </div>

              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenEdit(service)}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inactive Overlay Overlay */}
            {!service.active && (
              <div className="absolute inset-0 bg-black/60 pointer-events-none flex items-center justify-center">
                <span className="bg-charcoal/80 border border-white/10 px-4 py-2 font-sans text-xs uppercase tracking-widest text-red-400">
                  Inactive
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ServiceModal 
          initialData={editingService} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}

'use client';

// We create a Client wrapper so we can hold the state of the ServiceModal
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceModal } from '@/components/admin/ServiceModal';
import { toggleServiceStatus, deleteService } from '@/app/actions/adminServices';

type MediaObj = { id: string; url: string; type: string };

type ServiceData = {
  id: string;
  name: string;
  slug: string | null;
  description: string;
  price: number;
  duration: string;
  active: boolean;
  workers?: { id: string }[];
  medias?: MediaObj[];
};

type UserData = { id: string; name: string };

export function ServicesDashboardClient({ 
  initialServices
}: { 
  initialServices: ServiceData[];
}) {
  const services = initialServices;
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

  function renderServiceCard(service: ServiceData) {
    const coverImage = service.medias?.find(m => m.type === 'image' || m.url.match(/\.(jpeg|jpg|gif|png|webp)$/i))?.url;

    return (
      <motion.div 
        key={service.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className={`relative flex flex-col rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-all group ${
          service.active ? 'bg-white/5 hover:bg-white/10 hover:border-white/10' : 'bg-black/40 opacity-80'
        }`}
      >
        {/* Banner Image */}
        <div className="h-40 w-full bg-charcoal relative shrink-0">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={service.name}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${!service.active && 'grayscale opacity-50'}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-white/5 to-white/10 flex items-center justify-center">
              <span className="text-white/20 font-sans text-xs tracking-widest uppercase">No Image</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Quick Actions overlayed on image */}
          <div className="absolute top-4 left-4 flex gap-2">
            {!service.active && (
              <span className="bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest backdrop-blur-md">
                Inactive
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4 z-10">
            <button 
              aria-label={service.active ? 'Disable service' : 'Enable service'}
              onClick={(e) => { e.stopPropagation(); handleToggleActive(service.id, service.active); }}
              className={`w-4 h-4 rounded-full border-2 border-transparent transition-all shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                service.active ? 'bg-emerald-400 hover:bg-emerald-300' : 'bg-red-400 hover:bg-red-300'
              }`}
              title={service.active ? "Click to Disable" : "Click to Enable"}
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className={`font-playfair text-xl mb-2 ${service.active ? 'text-gold' : 'text-gray-400'}`}>
            {service.name}
          </h3>
          
          <p className="text-gray-400 text-sm font-sans mb-6 line-clamp-3 leading-relaxed flex-grow">
            {service.description}
          </p>

          {/* Footer Info & Actions */}
          <div className="pt-4 mt-auto border-t border-white/10 flex items-end justify-between">
            <div>
              <div className={`font-playfair text-xl tracking-wide ${service.active ? 'text-white' : 'text-gray-500'}`}>
                {service.price.toLocaleString()} RWF
              </div>
              <div className="font-sans text-xs text-gray-500 mt-0.5 uppercase tracking-widest">
                {service.duration} mins
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleOpenEdit(service)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                onClick={() => handleDelete(service.id)}
                className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 flex items-center justify-center transition-all"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

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
          className="flex items-center gap-2 bg-gold text-charcoal px-5 py-2.5 rounded-lg font-sans text-sm tracking-wide hover:bg-gold/90 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-playfair text-white border-b border-white/10 pb-3 flex items-center justify-between">
          <span>All Services</span>
          <span className="text-sm font-sans text-white/30 tracking-widest uppercase">{services.length} services</span>
        </h2>
        
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {services.map(service => renderServiceCard(service))}
          </AnimatePresence>
        </motion.div>
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

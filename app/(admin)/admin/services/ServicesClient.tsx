'use client';

// We create a Client wrapper so we can hold the state of the ServiceModal
import { useState } from 'react';
import { ActionButton, StatusBadge, DataTable } from '@/components/ui';
import { ServiceModal } from '@/components/admin/ServiceModal';
import { toggleServiceStatus, deleteService } from '@/app/actions/adminServices';

type ServiceData = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  active: boolean;
  categoryId?: string | null;
  workers?: { id: string }[];
};

type CategoryData = { id: string; name: string; order: number };
type UserData = { id: string; name: string };

export function ServicesDashboardClient({ 
  initialServices,
  categories,
  users 
}: { 
  initialServices: ServiceData[];
  categories: CategoryData[];
  users: UserData[];
}) {
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
          className="flex items-center gap-2 bg-gold text-charcoal px-5 py-2.5 rounded-lg font-sans text-sm tracking-wide hover:bg-gold/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      <div className="space-y-12">
        {/* Helper function to render a category block */}
        {(() => {
          const categorizedSections = categories.map(cat => ({
            ...cat,
            services: services.filter(s => s.categoryId === cat.id)
          })).filter(cat => cat.services.length > 0);

          const uncategorized = services.filter(s => !s.categoryId);

          return (
            <>
              {categorizedSections.map(section => (
                <div key={section.id} className="space-y-4">
                  <h2 className="text-xl font-playfair text-gold border-b border-white/10 pb-2">{section.name}</h2>
                  <DataTable
                    data={section.services}
                    columns={['Status', 'Service Name', 'Details / Description', 'Price & Duration', 'Actions']}
                    emptyStateMessage="No services in this category."
                    renderRow={(service) => (
                      <tr key={service.id} className={`transition-colors hover:bg-white/[0.02] ${!service.active ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleToggleActive(service.id, service.active)}
                            className={`w-3 h-3 rounded-full cursor-pointer transition-colors shrink-0 ${
                              service.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                            }`}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-playfair text-lg text-white">{service.name}</span>
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">
                              {service.workers?.length || 0} Staff Assigned
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-400 text-xs line-clamp-2 max-w-xs">{service.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-gold font-medium">{service.price.toLocaleString()} RWF</span>
                            <span className="text-[10px] text-gray-500">{service.duration} mins</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenEdit(service)} className="text-xs text-gray-400 hover:text-white">Edit</button>
                            <button onClick={() => handleDelete(service.id)} className="text-xs text-gray-400 hover:text-red-400">Delete</button>
                          </div>
                        </td>
                      </tr>
                    )}
                    renderCard={(service) => (
                      <div className="p-6 flex flex-col relative group">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">
                              {service.workers?.length || 0} Assig. Staff
                            </span>
                            <h3 className="font-playfair text-xl text-white">{service.name}</h3>
                          </div>
                          <button 
                            onClick={() => handleToggleActive(service.id, service.active)}
                            className={`w-3 h-3 rounded-full cursor-pointer transition-colors shrink-0 mt-1 ${
                              service.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                            }`}
                          />
                        </div>
                        <p className="text-gray-400 text-sm font-sans mb-6"> {service.description} </p>
                        <div className="flex justify-between items-end pt-4 border-t border-white/5">
                          <div>
                            <div className="font-playfair text-lg text-gold">{service.price.toLocaleString()} RWF</div>
                            <div className="font-sans text-xs text-gray-500">{service.duration} mins</div>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => handleOpenEdit(service)} className="text-gray-400 hover:text-white transition-colors text-sm">Edit</button>
                            <button onClick={() => handleDelete(service.id)} className="text-gray-400 hover:text-red-400 transition-colors text-sm">Delete</button>
                          </div>
                        </div>
                        {!service.active && (
                          <div className="absolute inset-0 bg-black/40 pointer-events-none flex items-center justify-center">
                            <span className="bg-charcoal/80 border border-white/10 px-4 py-1 font-sans text-[10px] uppercase tracking-widest text-red-400">Inactive</span>
                          </div>
                        )}
                      </div>
                    )}
                  />
                </div>
              ))}
              
              {uncategorized.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-playfair text-gray-400 border-b border-white/10 pb-2">Uncategorized Services</h2>
                  <DataTable
                    data={uncategorized}
                    columns={['Status', 'Service Name', 'Details', 'Price', 'Actions']}
                    emptyStateMessage="No uncategorized services."
                    renderRow={(service) => (
                      <tr key={service.id} className={`hover:bg-white/[0.02] ${!service.active ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-4">
                            <button 
                                onClick={() => handleToggleActive(service.id, service.active)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    service.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                }`}
                            />
                        </td>
                        <td className="px-6 py-4 text-white font-medium">{service.name}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs">{service.description}</td>
                        <td className="px-6 py-4 text-gold font-medium">{service.price.toLocaleString()} RWF</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenEdit(service)} className="text-xs text-gray-400 hover:text-white">Edit</button>
                            <button onClick={() => handleDelete(service.id)} className="text-xs text-gray-400 hover:text-red-400">Delete</button>
                          </div>
                        </td>
                      </tr>
                    )}
                    renderCard={(service) => (
                      <div className="p-4 border border-white/5 relative group">
                        <div className="flex justify-between">
                            <h3 className="text-white font-medium">{service.name}</h3>
                            <button 
                                onClick={() => handleToggleActive(service.id, service.active)}
                                className={`w-3 h-3 rounded-full ${service.active ? 'bg-green-500' : 'bg-red-500'}`}
                            />
                        </div>
                        <p className="text-xs text-gray-500 my-2">{service.description}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gold font-bold">RWF {service.price.toLocaleString()}</span>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenEdit(service)} className="text-xs text-gray-400">Edit</button>
                                <button onClick={() => handleDelete(service.id)} className="text-xs text-red-500/70">Delete</button>
                            </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}
            </>
          );
        })()}
      </div>

      {isModalOpen && (
        <ServiceModal 
          initialData={editingService} 
          categories={categories}
          workers={users}
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );

  function renderServiceCard(service: ServiceData) {
    return (
      <div key={service.id} className="admin-surface-alt border border-white/5 p-6 flex flex-col relative group">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-gray-500 mb-1 block">
              {service.workers?.length || 0} Assig. Staff
            </span>
            <h3 className="font-playfair text-xl text-white">{service.name}</h3>
          </div>
          
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

        {!service.active && (
          <div className="absolute inset-0 bg-black/60 pointer-events-none flex items-center justify-center">
            <span className="bg-charcoal/80 border border-white/10 px-4 py-2 font-sans text-xs uppercase tracking-widest text-red-400">
              Inactive
            </span>
          </div>
        )}
      </div>
    );
  }
}

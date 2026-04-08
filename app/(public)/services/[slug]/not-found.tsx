import Link from 'next/link';

export default function ServiceNotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-cream-white pt-24">
      <div className="max-w-xl mx-auto">
        <div className="font-playfair text-gold text-6xl mb-4">404</div>
        <h1 className="font-playfair text-4xl text-charcoal mb-4">Service Not Found</h1>
        <p className="text-gray-600 font-sans mb-8">
          The service you are looking for has been removed or no longer exists. 
          Please explore our other signature treatments.
        </p>
        <Link 
          href="/services" 
          className="inline-block bg-charcoal text-gold px-8 py-3 uppercase tracking-widest text-xs font-sans hover:bg-gold hover:text-charcoal transition-colors duration-300"
        >
          View All Services
        </Link>
      </div>
    </main>
  );
}

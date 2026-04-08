import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Script from 'next/script';
import { getServiceSchema, getFAQSchema, getBreadcrumbSchema } from '@/lib/seo';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // @ts-ignore - TS language server delay for prisma updates
  const services = await prisma.service.findMany({ select: { slug: true } });
  return services.filter((s: any) => s.slug).map((service: any) => ({
    slug: service.slug as string,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { medias: { take: 1 } },
  });

  if (!service) return {};

  // @ts-ignore - TS language server delay
  const coverImage = service.medias[0]?.url || `/api/og?title=${encodeURIComponent(service.name)}&description=${encodeURIComponent(service.description)}`;

  return {
    title: `${service.name} in Kigali`,
    description: `${service.description} Book ${service.name} for RWF ${service.price.toLocaleString()} at Mike Beauty Studio Kigali.`,
    alternates: {
      canonical: `https://mikebeautystudio.com/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.name} in Kigali | Mike Beauty Studio`,
      description: service.description,
      images: [coverImage],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  // @ts-ignore
  const service = await prisma.service.findUnique({
    // @ts-ignore
    where: { slug },
    include: { medias: true },
  });

  if (!service) {
    notFound();
  }

  // Predefined FAQs mapped dynamically for phase 4/5 integration
  const faqs = [
    {
      question: `How long does ${service.name} last?`,
      answer: `The longevity of ${service.name} depends on your aftercare routine, but typically you can expect beautiful results lasting several weeks. We recommend coming in for touch-ups as outlined by your technician.`
    },
    {
      question: `How much does ${service.name} cost in Kigali?`,
      answer: `At Mike Beauty Studio, ${service.name} is priced at RWF ${service.price.toLocaleString()}. We use premium products and provide luxury service to ensure the best results in Kigali.`
    },
    {
      question: `What is included in the ${service.name} service?`,
      answer: `The ${service.name} service includes a consultation, full application taking approximately ${service.duration}, and detailed aftercare instructions perfectly tailored to your needs.`
    },
    {
      question: `How to prepare for ${service.name}?`,
      answer: `Please arrive strictly with no makeup around your eyes or face, and avoid caffeine right before your appointment to ensure optimal application conditions.`
    },
    {
      question: `Is ${service.name} safe?`,
      answer: `Absolutely. At Mike Beauty Studio, we prioritize hygiene and use highly professional, tested materials. Every service is performed by an expert designed for your utmost safety.`
    }
  ];

  const serviceSchema = getServiceSchema(service);
  const faqSchema = getFAQSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Services', url: 'https://mikebeautystudio.com/services' },
    // @ts-ignore
    { name: service.name, url: `https://mikebeautystudio.com/services/${service.slug}` }
  ]);

  const related = await prisma.service.findMany({
    where: { active: true, id: { not: service.id } },
    take: 3,
  });

  return (
    <article className="min-h-screen bg-cream-white pt-32 pb-24">
      <Script id={`schema-service-${service.id}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id={`schema-faq-${service.id}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id={`schema-breadcrumb-${service.id}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Nav */}
        <nav aria-label="Breadcrumb" className="mb-10 text-xs font-sans tracking-widest uppercase text-charcoal/50">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-gold transition-colors">Home</Link></li>
            <li>&gt;</li>
            <li><Link href="/services" className="hover:text-gold transition-colors">Services</Link></li>
            <li>&gt;</li>
            <li className="text-charcoal font-semibold" aria-current="page">{service.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-playfair text-charcoal mb-6 leading-tight">
            {service.name} in Kigali, Rwanda
          </h1>
          <p className="text-lg md:text-xl text-charcoal/80 font-sans leading-relaxed">
            {service.description}
          </p>
        </header>

        {/* Key Facts */}
        <dl className="grid grid-cols-2 gap-8 mb-16 p-8 bg-[#f9f8f6] border border-black/5 rounded-2xl">
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-2">Price</dt>
            <dd className="font-playfair text-3xl text-gold">RWF {service.price.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-charcoal/50 mb-2">Duration</dt>
            <dd className="font-playfair text-3xl text-charcoal">{service.duration}</dd>
          </div>
        </dl>

        {/* Booking CTA */}
        <div className="mb-20">
          <Link 
            href={`/booking?serviceId=${service.id}`}
            className="inline-flex items-center justify-center w-full md:w-auto bg-charcoal text-gold px-10 py-5 font-sans tracking-widest text-sm uppercase hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-xl"
          >
            Book This Service
          </Link>
        </div>

        {/* Gallery Section */}
        {/* @ts-ignore */}
        {service.medias.length > 0 && (
          <section className="mb-20">
            <h2 className="text-2xl font-playfair text-charcoal mb-8 border-b border-black/5 pb-4">
              Portfolio & Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* @ts-ignore */}
              {service.medias.slice(0, 4).map((media: any) => (
                <div key={media.id} className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg group">
                  <Image
                    src={media.url}
                    alt={`${service.name} result`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-playfair text-charcoal mb-8 border-b border-black/5 pb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="pb-6 border-b border-black/5 border-dashed">
                <h3 className="font-playfair text-xl text-charcoal mb-2">{faq.question}</h3>
                <p className="font-sans text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Services */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-playfair text-charcoal mb-8 border-b border-black/5 pb-4">
              Explore More Treatments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.id} href={`/services/${(rel as any).slug}`} className="group block bg-[#f9f8f6] p-6 rounded-2xl hover:bg-charcoal transition-colors duration-500">
                  <h3 className="font-playfair text-xl text-charcoal group-hover:text-gold mb-2">{rel.name}</h3>
                  <p className="font-sans text-sm text-charcoal/60 group-hover:text-white/60 mb-4 line-clamp-2">{rel.description}</p>
                  <span className="text-xs uppercase tracking-widest text-gold opacity-80 group-hover:opacity-100">View Details &rarr;</span>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
}

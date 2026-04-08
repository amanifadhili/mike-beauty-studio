import Script from 'next/script';

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  if (!gaId) return null;
  return (
    <>
      {/* 
        We use afterInteractive for GA to ensure it loads immediately after the page becomes interactive,
        which provides accurate bounce rate analytics without blocking critical LCP rendering.
      */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}

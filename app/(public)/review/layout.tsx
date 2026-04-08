import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Share Your Experience | Mike Beauty Studio',
  description: 'Rate your service and share your thoughts to help us continue providing luxury experiences in Kigali.',
  alternates: { canonical: 'https://mikebeautystudio.com/review' },
  robots: { index: false },
};

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

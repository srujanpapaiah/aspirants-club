// src/app/pdfs/PDFViewerWrapper.tsx
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import PDFViewer from '../../components/PDFViewer';

export default function PDFViewerWrapper() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('pdfUrl');

  if (!pdfUrl) {
    return <p>No PDF URL provided</p>;
  }

  return <PDFViewer pdfUrl={pdfUrl} />;
}
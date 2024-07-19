'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import PDFViewer from '../../components/PDFViewer';

export default function PDFViewingPage() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get('pdfUrl');

  return (
    <div className="min-h-screen bg-[#040E12] text-white">
      <Header 
        searchQuery=""
        setSearchQuery={() => {}}
        isMobile={false}
        toggleSidebar={() => {}}
      />
      <main className="pt-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">PDF Document</h1>
          {pdfUrl ? (
            <PDFViewer pdfUrl={pdfUrl} />
          ) : (
            <p>No PDF URL provided</p>
          )}
        </div>
      </main>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FiZoomIn, FiZoomOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Ensure this line is present and correct
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => Math.min(Math.max(1, prevPageNumber + offset), numPages || 1));
  };

  const changeZoom = (delta: number) => {
    setScale(prevScale => Math.min(Math.max(0.5, prevScale + delta), 2));
  };

  return (
    <div className="bg-[#121717] text-white p-4 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">PDF Viewer</h2>
        <div className="flex space-x-2">
          <button onClick={() => changeZoom(-0.1)} className="p-2 bg-[#1AA38C] rounded-full hover:bg-[#158972] transition-colors">
            <FiZoomOut />
          </button>
          <button onClick={() => changeZoom(0.1)} className="p-2 bg-[#1AA38C] rounded-full hover:bg-[#158972] transition-colors">
            <FiZoomIn />
          </button>
        </div>
      </div>
      <div className="overflow-auto max-h-[calc(100vh-200px)] bg-[#1E2A2F] rounded-lg">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center"
        >
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>
      {numPages && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className="p-2 bg-[#1AA38C] rounded-full hover:bg-[#158972] transition-colors disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            className="p-2 bg-[#1AA38C] rounded-full hover:bg-[#158972] transition-colors disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
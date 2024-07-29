// File: types/pdf-parse.d.ts
declare module 'pdf-parse/lib/pdf-parse.js' {
    function pdfParse(dataBuffer: Buffer, options?: any): Promise<{
      numpages: number;
      numrender: number;
      info: any;
      metadata: any;
      text: string;
      version: string;
    }>;
  
    export = pdfParse;
  }
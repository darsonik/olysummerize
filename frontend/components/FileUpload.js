import React, { useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/webpack';

// Set the worker source - typically you would need to configure this in your project
// This is a placeholder - in a real app, configure this according to your build system
// import { Document, Page, pdfjs } from "react-pdf";
// import pdfjsWorker from "react-pdf/node_modules/pdfjs-dist/build/pdf.worker.entry";
// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * FileUpload Component - Allows users to upload text or PDF files
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onFileUpload - Callback function that receives the file contents
 * @returns {JSX.Element} A file input element with loading state
 */
const FileUpload = ({ onFileUpload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Extracts text from a PDF document
   * 
   * @param {ArrayBuffer} data - The PDF file data
   * @returns {Promise<string>} - Promise resolving to the extracted text
   */
  const extractTextFromPDF = async (data) => {
    try {
      // Load the PDF document
      const pdf = await pdfjs.getDocument({ data }).promise;
      let fullText = '';
      
      // Loop through each page
      for (let i = 1; i <= pdf.numPages; i++) {
        // Get the page
        const page = await pdf.getPage(i);
        
        // Extract text content from the page
        const textContent = await page.getTextContent();
        
        // Concatenate the text items with spaces
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ');
          
        fullText += pageText + '\n\n';
      }
      
      return fullText.trim();
    } catch (err) {
      throw new Error(`Failed to extract text from PDF: ${err.message}`);
    }
  };

  /**
   * Handles file selection event
   * 
   * @param {Event} event - The change event from the file input
   */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (file.type === 'application/pdf') {
        // Handle PDF files
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          try {
            // Convert file to ArrayBuffer for PDF.js
            const arrayBuffer = e.target.result;
            const text = await extractTextFromPDF(arrayBuffer);
            onFileUpload({
              name: file.name,
              type: file.type,
              content: text
            });
            setIsLoading(false);
          } catch (err) {
            setError(err.message);
            setIsLoading(false);
          }
        };
        
        reader.onerror = () => {
          setError('Error reading the file');
          setIsLoading(false);
        };
        
        // Read file as ArrayBuffer for PDF processing
        reader.readAsArrayBuffer(file);
      } else {
        // Handle text files as before
        const reader = new FileReader();
        
        reader.onload = (e) => {
          onFileUpload({
            name: file.name,
            type: file.type,
            content: e.target.result
          });
          setIsLoading(false);
        };
        
        reader.onerror = () => {
          setError('Error reading the file');
          setIsLoading(false);
        };
        
        reader.readAsText(file);
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".txt,.pdf" 
        onChange={handleFileChange} 
        disabled={isLoading}
      />
      {isLoading && <p>Loading file content...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default FileUpload;
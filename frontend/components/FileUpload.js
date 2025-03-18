import React, {useState} from 'react';
import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const FileUpload = ({onFileUpload}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to extract text from PDF
    const extractTextFromPDF = async (data) => {
        try{
            //load the pdf document
            const pdf = await pdfjs.getDocument({data}).promise;
            let fullText = '';
            //iterate through each page
            for(let i=1; i<=pdf.numPages; i++){
                //get the page
                const page = await pdf.getPage(i);
                
                //get the text content
                const textContent = await page.getTextContent();
                
                //concatenate the text content with spaces
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';                
            }
            return fullText.trim();
        } catch(err){
            throw new Error(`Error extracting text from PDF: ${err.message}`);
        }
    };
}

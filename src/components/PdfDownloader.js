import React from 'react';
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";

const PdfDownloader = ({rootElementId, DownloadFileName}) => {
    const downloadPdfDocument = () =>{
        const input = document.getElementById(rootElementId);
        html2canvas(input)
            .then((canvas)=>{
                const imgData = canvas.toDataURL('image/png');
                let position=0;
                const imgWidth= 3;
                const pageHeight= 9;
                let imgHeight=canvas.height * imgWidth/canvas.width;
                let heightLeft=imgHeight; 
                // const pdf = new jsPDF({orientation:'p', unit:'in', format:[9, 6.5]});
                const pdf = new jsPDF({orientation:'p', unit:'in',format:[9, 3.125]});
                // pdf.addImage(imgData, 'JPEG', 0.1, 0.1);
        
                
                //! now we add content to that page!
                pdf.addImage(imgData, 'JPEG', 0.05, position +0.1, imgWidth, imgHeight);
                heightLeft-=pageHeight;
                
                while(heightLeft>=0) {
                    position=heightLeft-imgHeight;
                    // pdf.addPage([9, 6.5], 'p'); //in*72)
                    pdf.addPage(); //in*72)
                    pdf.addImage(imgData, 'JPEG', 0.05, position+0.1, imgWidth, imgHeight);
                    heightLeft-=pageHeight;
                }
                
                pdf.autoPrint();
                
                pdf.save(`${DownloadFileName}.pdf`);
            })
    }
    return <button type="button" className="btn btn-light btn-sm badge" style={{fontSize:"0.75rem"}} onClick={downloadPdfDocument}>Download PDF</button>
}

export default PdfDownloader;
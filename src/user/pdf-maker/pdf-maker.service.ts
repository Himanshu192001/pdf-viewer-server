import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable()
export class PdfMakerService {
    async generatePdf(data: any[]): Promise<Buffer> 
    {
        const pdfDoc = await PDFDocument.create();
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;
        const tableTop = height - 50;
        const leftMargin = 50;
        const rowHeight = 20;
    
        page.drawText('Table Data of User', {
          x: leftMargin,
          y: height - 30,
          size: 18,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
    
        // Table header
        const headers = ['Email', 'Name', 'Mobile' , 'Address'];
        headers.forEach((header, i) => {
          page.drawText(header, {
            x: leftMargin + i * 100,
            y: tableTop,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
        });
    
        // Table rows
        data.forEach((item, rowIndex) => {
          const y = tableTop - (rowIndex + 1) * rowHeight;
          page.drawText(item.email, { x: leftMargin, y, size: fontSize, font: timesRomanFont });
          page.drawText(item.name, { x: leftMargin + 100, y, size: fontSize, font: timesRomanFont });
          page.drawText(String(item.mobile), { x: leftMargin + 200, y, size: fontSize, font: timesRomanFont });
          page.drawText(item.address, { x: leftMargin + 300, y, size: fontSize, font: timesRomanFont });
        });
    
        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
    
    
}



//  async generatePdf(data: any[]): Promise<Buffer> {
//     const fonts = {
//         Roboto: {
//           normal: 'node_modules/pdfmake/build/vfs_fonts.js',
//           bold: 'node_modules/pdfmake/build/vfs_fonts.js',
//           italics: 'node_modules/pdfmake/build/vfs_fonts.js',
//           bolditalics: 'node_modules/pdfmake/build/vfs_fonts.js',
//         },
//       };
  
//       const printer = new PdfPrinter(fonts);
  
//       const tableBody = [
//         ['Email', 'Name', 'Address', 'Mobile'], // Table Header
//         ...data.map((item) => [item.email, item.name, item.address, item.mobile]),
//       ];
  
//       const docDefinition = {
//         content: [
//           { text: 'User Data', style: 'header' },
//           {
//             style: 'tableExample',
//             table: {
//               headerRows: 1,
//               body: tableBody,
//             },
//           },
//         ],
//         styles: {
//           header: {
//             fontSize: 18,
//             bold: true,
//             margin: [0, 0, 0, 10],
//           },
//           tableExample: {
//             margin: [0, 5, 0, 15],
//           },
//           tableHeader: {
//             bold: true,
//             fontSize: 13,
//             color: 'black',
//           },
//         },
//       };
  
//       const pdfDoc = printer.createPdfKitDocument(docDefinition);
//       const chunks = [];
  
//       return new Promise<Buffer>((resolve, reject) => {
//         pdfDoc.on('data', (chunk) => {
//           chunks.push(chunk);
//         });
  
//         pdfDoc.on('end', () => {
//           const result = Buffer.concat(chunks);
//           resolve(result);
//         });
  
//         pdfDoc.on('error', (err) => {
//           reject(err);
//         });
  
//         pdfDoc.end();
//       });
//     }
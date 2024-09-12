import { Component } from '@angular/core';
import {jsPDF} from 'jspdf';

@Component({
  selector: 'app-pdf-report',
  templateUrl: './pdf-report.component.html',
  styleUrl: './pdf-report.component.css'
})
export class PdfReportComponent {

  data = Array.from({length:100}, (_,i)=>`Item ${i+1}`);
  nombreAuthor = 'Juan Perez';
  fechaNow= new Date().toLocaleDateString();


  public generatePDF():void {

    const pdf = new jsPDF('p','mm','letter');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const logoWidth = 20;
    const itemsPerPage = 20;
    let currentY = 40;

    const nombre = this.nombreAuthor;
    const fecha = this.fechaNow;

    //Agregar logo en la parte superior derecha
    const addLogo = ()=>{

      const logoUrl=  '../../assets/img/marca4.jpg';
      const marginRight = 10;
      const xPos = pageWidth - logoWidth -marginRight;
      pdf.addImage(logoUrl, 'JPG', xPos, 10, logoWidth,20);

    }

    //Agregar Cabezera

    const addTableHeader = ()=>{
      pdf.setFont('Helvetica','bold');
      pdf.setFontSize(20);
      pdf.text('Reporte de Datos', 10, 35);

      //Agregar nombre y fecha debajo del titulo
      pdf.setFontSize(10);
      pdf.setFont('Helvetica','normal');
      pdf.text(`Nombre: ${nombre}`, 10, 40);
      pdf.text(`fecha: ${fecha}`, 10, 45);

      pdf.setDrawColor(0);
      pdf.setFillColor(200,200,200);

      currentY = 55;

      pdf.rect(10, currentY, 10, 10, 'FD');
      pdf.rect(20, currentY, pageWidth - 30, 10, 'FD');

      pdf.setTextColor(0);
      pdf.text('#',13, currentY + 7);
      pdf.text('Item',23, currentY + 7);

      currentY += 10;
      
    };


    // Agregar filas con bordes

    const addTableRow = (index:number, item:string)=>{

      pdf.setFont('Helvetica','normal');
      pdf.setFontSize(10);

      //Dibujar las Celdas
      pdf.rect(10,currentY,10,10);
      pdf.rect(20,currentY,pageWidth-30,10);

      // texto en las celdas
      pdf.setTextColor(0);
      pdf.text(`${index + 1} `,13,currentY + 7);
      pdf.text(item,23,currentY + 7);

      currentY += 10;

    };

    // Agregar numero de pagina en el pie de pagina

    const addPageNumbers = ()=>{
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {

        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Pagina ${i} de ${pageCount}`, pageWidth - 50, pageHeight - 10);
      }

    };

    // Generar el reporte paginado
   
    const generateReport = ()=>{

      addLogo();
      addTableHeader();

      this.data.forEach((item,index)=>{

        if (index > 0 && index % itemsPerPage === 0) {

          pdf.addPage();
          currentY = 40;
          addLogo();
          addTableHeader();
          
        }

        addTableRow(index,item)

      });

      //Aggregar numeracion de paginas al final
      addPageNumbers();

      //Guardar PDF
      pdf.save('reporte_ejemplo.pdf');

    };

    //Cargar el logo y generar el reporte
    const logoImage = new Image();
    logoImage.src='../../assets/img/marca4.jpg';
    logoImage.onload = ()=>{

      generateReport();

    };
  }

}

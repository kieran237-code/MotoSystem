package com.designpattern.webmotosystem.Entities.documents.adapter;

import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import java.io.IOException;

public class PdfLibrary {
    public void writePDF(String text, String fileName) {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            PDPageContentStream content = new PDPageContentStream(doc, page);
            content.beginText();
            content.setFont(PDType1Font.HELVETICA_BOLD, 12);
            content.newLineAtOffset(100, 700);
            content.showText(text);
            content.endText();
            content.close();

            doc.save(fileName);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

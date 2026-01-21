package com.designpattern.webmotosystem.Entities.documents.bridge;

public class PDFRenderer implements FormsRenderer {
    @Override
    public void drawText(String label) {
        System.out.println("PDF Text: " + label);
    }

    @Override
    public void drawInput(String name) {
        System.out.println("PDF Input: " + name);
    }
}

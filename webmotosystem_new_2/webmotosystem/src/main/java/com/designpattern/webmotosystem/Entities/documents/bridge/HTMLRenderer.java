package com.designpattern.webmotosystem.Entities.documents.bridge;

public class HTMLRenderer implements FormsRenderer {
    @Override
    public void drawText(String label) {
        System.out.println("<p>" + label + "</p>");
    }

    @Override
    public void drawInput(String name) {
        System.out.println("<input name='" + name + "' />");
    }
}

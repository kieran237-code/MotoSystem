package com.designpattern.webmotosystem.Entities.documents.adapter;

public interface Document {
    void setContent(String content);
    void print();

    // 👉 Ajout des getters pour sérialisation et usage dans le controller
    String getContent();
    String getType();
}

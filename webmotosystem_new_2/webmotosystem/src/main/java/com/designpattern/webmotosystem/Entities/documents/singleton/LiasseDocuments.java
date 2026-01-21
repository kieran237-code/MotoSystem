package com.designpattern.webmotosystem.Entities.documents.singleton;

import com.designpattern.webmotosystem.Entities.documents.adapter.Document;
import java.util.ArrayList;
import java.util.List;

public class LiasseDocuments {
    private static LiasseDocuments instance;
    private List<Document> documents;

    private LiasseDocuments() {
        documents = new ArrayList<>();
    }

    public static LiasseDocuments getInstance() {
        if (instance == null) {
            instance = new LiasseDocuments();
        }
        return instance;
    }

    public void addDocument(Document doc) {
        documents.add(doc);
    }

    public List<Document> getDocuments() {
        return documents;
    }
}

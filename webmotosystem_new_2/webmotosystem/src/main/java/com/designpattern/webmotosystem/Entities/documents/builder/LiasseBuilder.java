package com.designpattern.webmotosystem.Entities.documents.builder;

import com.designpattern.webmotosystem.Entities.documents.adapter.Document;
import java.util.List;

public interface LiasseBuilder {
    void buildDemandeImmatriculation();
    void buildCertificatCession();
    void buildBonCommande();
    List<Document> getResult();
}

package com.designpattern.webmotosystem.Entities.documents.builder;

import com.designpattern.webmotosystem.Entities.documents.adapter.Document;
import java.util.List;

public class LiasseDirector {
    private LiasseBuilder builder;

    public LiasseDirector(LiasseBuilder builder) {
        this.builder = builder;
    }

    public List<Document> construct() {
        builder.buildDemandeImmatriculation();
        builder.buildCertificatCession();
        builder.buildBonCommande();
        return builder.getResult();
    }
}

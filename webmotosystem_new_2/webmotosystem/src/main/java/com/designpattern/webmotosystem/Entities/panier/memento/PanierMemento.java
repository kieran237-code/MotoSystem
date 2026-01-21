// src/main/java/com/designpattern/webmotosystem/panier/memento/PanierMemento.java
package com.designpattern.webmotosystem.Entities.panier.memento;

import com.designpattern.webmotosystem.Entities.panier.Panier;

public class PanierMemento {
    private final Panier snapshot;
    public PanierMemento(Panier snapshot) { this.snapshot = snapshot; }
    public Panier getSnapshot() { return snapshot; }
}

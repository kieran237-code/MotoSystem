// src/main/java/com/designpattern/webmotosystem/panier/command/PanierCommand.java
package com.designpattern.webmotosystem.Entities.panier.command;

public interface PanierCommand {
    void execute();
    void undo();
}

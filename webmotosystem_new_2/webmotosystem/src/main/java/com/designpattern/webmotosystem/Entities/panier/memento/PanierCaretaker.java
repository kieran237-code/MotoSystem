// src/main/java/com/designpattern/webmotosystem/panier/memento/PanierCaretaker.java
package com.designpattern.webmotosystem.Entities.panier.memento;

import java.util.ArrayDeque;
import java.util.Deque;

public class PanierCaretaker {
    private final Deque<PanierMemento> undoStack = new ArrayDeque<>();
    private final Deque<PanierMemento> redoStack = new ArrayDeque<>();

    public void pushUndo(PanierMemento m) { undoStack.push(m); redoStack.clear(); }
    public PanierMemento popUndo() { return undoStack.isEmpty() ? null : undoStack.pop(); }
    public void pushRedo(PanierMemento m) { redoStack.push(m); }
    public PanierMemento popRedo() { return redoStack.isEmpty() ? null : redoStack.pop(); }
    public void clear() { undoStack.clear(); redoStack.clear(); }
}

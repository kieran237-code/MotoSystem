package com.designpattern.webmotosystem.Services.taxe;

import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class TaxeStrategyFactory {

    private final TaxeFrance taxeFrance;
    private final TaxeCameroun taxeCameroun;
    private final TaxeDefault taxeDefault;

    public TaxeStrategyFactory(TaxeFrance taxeFrance,
                               TaxeCameroun taxeCameroun,
                               TaxeDefault taxeDefault) {
        this.taxeFrance = taxeFrance;
        this.taxeCameroun = taxeCameroun;
        this.taxeDefault = taxeDefault;
    }

    public TaxeStrategy getStrategy(String pays) {
        if (pays == null) return taxeDefault;
        String p = pays.toLowerCase(Locale.ROOT);
        switch (p) {
            case "france": return taxeFrance;
            case "cameroun": return taxeCameroun;
            default: return taxeDefault;
        }
    }
}

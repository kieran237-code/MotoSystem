package com.designpattern.webmotosystem.Services.taxe;

import org.springframework.stereotype.Component;

@Component
public class TaxeDefault implements TaxeStrategy {
    @Override
    public double calculerTaxe(double montantBase) {
        return 0.0;
    }
}

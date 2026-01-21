package com.designpattern.webmotosystem.Services.taxe;

import org.springframework.stereotype.Component;

@Component
public class TaxeFrance implements TaxeStrategy {
    @Override
    public double calculerTaxe(double montantBase) {
        return montantBase * 0.20;
    }
}

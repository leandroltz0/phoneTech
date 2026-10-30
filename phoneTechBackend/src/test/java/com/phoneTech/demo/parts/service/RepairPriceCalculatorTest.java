package com.phoneTech.demo.parts.service;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class RepairPriceCalculatorTest {

    private final RepairPriceCalculator calculator = new RepairPriceCalculator();

    @Test
    void calculatesMaximumPurchasePriceKeepingMinimumProfit() {
        RepairPriceCalculator.Result result = calculator.calculate(
                new BigDecimal("150000.00"), new BigDecimal("45000.00"));

        assertThat(result.maximumPurchasePrice()).isEqualByComparingTo("80000.00");
        assertThat(result.projectedProfit()).isEqualByComparingTo("25000.00");
        assertThat(result.purchaseAllowed()).isTrue();
    }

    @Test
    void rejectsPurchaseWhenSalePriceAndRepairsCannotLeaveMinimumProfit() {
        RepairPriceCalculator.Result result = calculator.calculate(
                new BigDecimal("60000.00"), new BigDecimal("40000.00"));

        assertThat(result.maximumPurchasePrice()).isEqualByComparingTo("0.00");
        assertThat(result.projectedProfit()).isEqualByComparingTo("20000.00");
        assertThat(result.purchaseAllowed()).isFalse();
    }
}

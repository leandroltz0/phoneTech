package com.phoneTech.demo.parts.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class RepairPriceCalculator {

    public static final BigDecimal MINIMUM_PROFIT = new BigDecimal("25000.00");

    public Result calculate(BigDecimal resalePrice, BigDecimal repairPartsCost) {
        BigDecimal sale = money(resalePrice);
        BigDecimal repairs = money(repairPartsCost);
        BigDecimal theoreticalMaximumPurchase = sale.subtract(repairs).subtract(MINIMUM_PROFIT);
        BigDecimal maximumPurchase = theoreticalMaximumPurchase.max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
        BigDecimal projectedProfit = sale.subtract(repairs).subtract(maximumPurchase).setScale(2, RoundingMode.HALF_UP);

        return new Result(maximumPurchase, projectedProfit,
                theoreticalMaximumPurchase.compareTo(BigDecimal.ZERO) >= 0);
    }

    private BigDecimal money(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

    public record Result(
            BigDecimal maximumPurchasePrice,
            BigDecimal projectedProfit,
            boolean purchaseAllowed) {
    }
}

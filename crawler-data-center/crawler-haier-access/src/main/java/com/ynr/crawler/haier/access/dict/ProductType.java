package com.ynr.crawler.haier.access.dict;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/25 <br>
 */
public enum ProductType {
    PORK("pork"), CHICKEN("chicken"), EGG("egg");

    private String productType;

    ProductType(String productType) {
        this.productType = productType;
    }

    public static ProductType valueOfProductType(String value) {
        for (ProductType t : ProductType.values()) {
            if (value.equals(t.productType)) {
                return t;
            }
        }
        return null;
    }

}

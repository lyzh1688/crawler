package com.ynr.crawler.haier.access.model;

import lombok.Data;

@Data
public class CrawlerQts {
    private Integer batchId;

    private String company;

    private String prodtype;

    private String rule;

    private String unit;

    private String specs;

    private String certificationid;

    private String certdate;

    private String expiredate;

    private String status;

    private String iscancled;

}
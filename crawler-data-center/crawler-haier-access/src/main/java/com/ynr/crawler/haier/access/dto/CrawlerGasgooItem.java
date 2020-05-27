package com.ynr.crawler.haier.access.dto;

import lombok.Data;

import java.util.List;

/**
 * Code Monkey: 何彪 <br>
 * Dev Time: 2020/5/17 <br>
 */
@Data
public class CrawlerGasgooItem {

    private String searchTarget;
    private List<CrawlerGasgooCompany> items;
    private int totalCnt;

}

package com.ynr.crawler.haier.access.dto;

import lombok.Data;

import java.util.List;

/**
 * Code Monkey: 何彪<br>
 * Dev Time: 2020/5/17 <br>
 */
@Data
public class CrawlerGasgooCompany {

    private String company;
    private String automaker;
    private List<CrawlerGasgooBizItem> bizInfo;


}

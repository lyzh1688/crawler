package com.ynr.crawler.haier.access.dto;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/19 <br>
 */
@Data
public class CrawlerQtsItem {
    private int totalCnt;
    private List<CrawlerQtsCompany> items = Lists.newArrayList();


}

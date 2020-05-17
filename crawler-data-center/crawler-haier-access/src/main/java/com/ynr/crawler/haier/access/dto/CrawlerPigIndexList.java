package com.ynr.crawler.haier.access.dto;

import com.google.common.collect.Lists;
import lombok.Data;

import java.util.List;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/17 <br>
 */
@Data
public class CrawlerPigIndexList {
    private List<CrawlerPigIndexItem> items = Lists.newArrayList();
}

package com.ynr.crawler.haier.access.dto;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/17 <br>
 */
@Data
public class CrawlerJgjcInfo {
    private String dataDate;
    private String releaseDate;
    Map<String, CrawlerJgjcItem> pork = new HashMap<>();
    Map<String, CrawlerJgjcItem> chicken = new HashMap<>();
    Map<String, CrawlerJgjcItem> egg = new HashMap<>();
}

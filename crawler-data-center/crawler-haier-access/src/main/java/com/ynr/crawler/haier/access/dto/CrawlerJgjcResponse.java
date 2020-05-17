package com.ynr.crawler.haier.access.dto;

import com.ynr.crawler.data.center.common.CrawlerResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashMap;
import java.util.Map;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/17 <br>
 */
@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
public class CrawlerJgjcResponse extends CrawlerResponse {

    Map<String, Map<String, Map<String, CrawlerJgjcItem>>> payload = new HashMap<>();

}

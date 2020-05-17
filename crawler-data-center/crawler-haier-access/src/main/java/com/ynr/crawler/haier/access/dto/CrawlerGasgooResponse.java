package com.ynr.crawler.haier.access.dto;

import com.ynr.crawler.data.center.common.CrawlerResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/18 <br>
 */
@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
public class CrawlerGasgooResponse extends CrawlerResponse {
    private CrawlerGasgooItem payload;
}

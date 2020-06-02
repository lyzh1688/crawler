package com.ynr.crawler.haier.access.dto;

import com.ynr.crawler.data.center.common.CrawlerResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * Code Monkey: �α� <br>
 * Dev Time: 2020/5/17 <br>
 */
@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
public class CrawlerJgjcResponse extends CrawlerResponse {

    private CrawlerJgjcList payload;

}

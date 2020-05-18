package com.ynr.crawler.data.center.common;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/17 <br>
 */
@Builder
@ToString
@Accessors(chain = true)
public class CrawlerResponse {
    @Getter
    @Setter
    int retCode = RetCode.SUCCESS;
    @Getter
    @Setter
    String retInfo = "OK";

    public CrawlerResponse(int retCode, String retInfo) {
        this.retCode = retCode;
        this.retInfo = retInfo;
    }

    public CrawlerResponse() {
    }
}

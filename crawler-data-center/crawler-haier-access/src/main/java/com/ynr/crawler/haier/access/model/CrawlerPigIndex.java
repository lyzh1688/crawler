package com.ynr.crawler.haier.access.model;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@TableName("crawler_pigindex_result")
public class CrawlerPigIndex extends Model<CrawlerPigIndex> {
    private Integer batchId;

    private String index;

    private String dataDate;

    private String changeRate;

    private String change;

    private String region;

    private String bookingPrice;

    private String tradePrice;

    private String avgTradeWeight;
}
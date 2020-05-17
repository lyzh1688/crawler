package com.ynr.crawler.haier.access.model;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@TableName("crawler_jgjc_result")
public class CrawlerJgjc extends Model<CrawlerJgjc> {
    private Integer batchId;

    private String dateDate;

    private String productType;

    private String statType;

    private String rawPrice;

    private String fodderPrice;

    private String rate;

    private String balance;

    private String profitCount;

    private String updateDate;

}
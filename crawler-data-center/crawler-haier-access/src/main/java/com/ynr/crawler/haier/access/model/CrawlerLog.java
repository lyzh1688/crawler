package com.ynr.crawler.haier.access.model;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@TableName("crawler_log")
public class CrawlerLog extends Model<CrawlerLog> {
    private Integer batchId;

    private String crawlerType;

    private String updateDate;

    private String step;

    private String message;

}
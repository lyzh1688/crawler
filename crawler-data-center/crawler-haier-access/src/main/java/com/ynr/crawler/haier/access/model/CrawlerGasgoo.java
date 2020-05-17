package com.ynr.crawler.haier.access.model;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.google.common.collect.Lists;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@TableName("crawler_gasgoo_result")
public class CrawlerGasgoo extends Model<CrawlerGasgoo> {
    private Integer batchId;

    private String month;

    private String searchTarget;

    private String company;

    private List<CrawlerGasgooAttr> attrs = Lists.newArrayList();

}
package com.ynr.crawler.haier.access.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ynr.crawler.haier.access.model.CrawlerPigIndex;

import java.util.List;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/17 <br>
 */
public interface CrawlerPigIndexService extends IService<CrawlerPigIndex> {

    List<CrawlerPigIndex> queryCrawlerPigIndexData(String beginDate, String endDate);

}

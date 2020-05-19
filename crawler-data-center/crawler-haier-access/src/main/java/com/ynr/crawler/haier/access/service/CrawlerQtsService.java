package com.ynr.crawler.haier.access.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.ynr.crawler.haier.access.model.CrawlerQts;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/17 <br>
 */
public interface CrawlerQtsService extends IService<CrawlerQts> {

    IPage<CrawlerQts> queryCrawlerQtsData(String month, int pageId);

}

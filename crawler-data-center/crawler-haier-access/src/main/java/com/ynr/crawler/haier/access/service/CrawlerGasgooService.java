package com.ynr.crawler.haier.access.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.ynr.crawler.haier.access.model.CrawlerGasgoo;

import java.util.List;

/**
 * Code Monkey: �α� <br>
 * Dev Time: 2020/5/17 <br>
 */
public interface CrawlerGasgooService extends IService<CrawlerGasgoo> {

    IPage<CrawlerGasgoo> queryCrawlerGasgooData(String searchTarget, String month, int pageId,int pageSize);

}

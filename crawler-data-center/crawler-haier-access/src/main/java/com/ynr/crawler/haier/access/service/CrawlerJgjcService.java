package com.ynr.crawler.haier.access.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ynr.crawler.haier.access.model.CrawlerJgjc;

import java.util.List;

/**
 * Code Monkey: 何彪 <br>
 * Dev Time: 2020/5/17 <br>
 */
public interface CrawlerJgjcService extends IService<CrawlerJgjc> {
    List<CrawlerJgjc> queryCrawlerJgjc(String target, String begin,String end);


}

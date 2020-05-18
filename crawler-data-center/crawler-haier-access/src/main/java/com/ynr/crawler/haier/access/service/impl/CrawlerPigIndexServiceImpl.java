package com.ynr.crawler.haier.access.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ynr.crawler.haier.access.dao.CrawlerPigIndexMapper;
import com.ynr.crawler.haier.access.model.CrawlerPigIndex;
import com.ynr.crawler.haier.access.service.CrawlerPigIndexService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/17 <br>
 */
@Service
@AllArgsConstructor
public class CrawlerPigIndexServiceImpl extends ServiceImpl<CrawlerPigIndexMapper, CrawlerPigIndex> implements CrawlerPigIndexService {

    @Override
    public List<CrawlerPigIndex> queryCrawlerPigIndexData(String beginDate, String endDate) {
        return this.baseMapper.selectByDate(beginDate, endDate);
    }
}

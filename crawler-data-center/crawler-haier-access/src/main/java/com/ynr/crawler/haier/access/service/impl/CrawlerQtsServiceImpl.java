package com.ynr.crawler.haier.access.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ynr.crawler.haier.access.dao.CrawlerQtsMapper;
import com.ynr.crawler.haier.access.model.CrawlerQts;
import com.ynr.crawler.haier.access.service.CrawlerQtsService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Code Monkey: 何彪<br>
 * Dev Time: 2020/5/18 <br>
 */
@Service
@AllArgsConstructor
public class CrawlerQtsServiceImpl extends ServiceImpl<CrawlerQtsMapper, CrawlerQts> implements CrawlerQtsService {

    @Override
    public IPage<CrawlerQts> queryCrawlerQtsData(String month, int pageId) {

        Page page = new Page(pageId, 1000);
        return this.baseMapper.selectCrawlerQtsByPage(page, month);
    }
}

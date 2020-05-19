package com.ynr.crawler.haier.access.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ynr.crawler.haier.access.dao.CrawlerGasgooMapper;
import com.ynr.crawler.haier.access.model.CrawlerGasgoo;
import com.ynr.crawler.haier.access.service.CrawlerGasgooService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Code Monkey: 何彪 <br>
 * Dev Time: 2020/5/17 <br>
 */
@Service
@AllArgsConstructor
public class CrawlerGasgooServiceImpl extends ServiceImpl<CrawlerGasgooMapper, CrawlerGasgoo> implements CrawlerGasgooService {
    @Override
    public IPage<CrawlerGasgoo> queryCrawlerGasgooData(String searchTarget, String month, int pageId) {
        Page page = new Page();
        page.setCurrent(pageId);
        page.setSize(20);
        IPage<CrawlerGasgoo> iPage = this.baseMapper.selectByTarget(page, searchTarget, month);
        if (iPage.getRecords().size() == 0) {
            return iPage;
        }
        List<String> targetList = iPage.getRecords().stream()
                .map(CrawlerGasgoo::getCompany)
                .collect(Collectors.toList());
        iPage.setTotal((long) iPage.getRecords().size());
        List<CrawlerGasgoo> gasgooList = this.baseMapper.selectTargetAttr(searchTarget, targetList, month);
        iPage.setRecords(gasgooList);
        return iPage;
    }
}

package com.ynr.crawler.haier.access.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.google.common.collect.Lists;
import com.ynr.crawler.haier.access.dao.CrawlerGasgooMapper;
import com.ynr.crawler.haier.access.model.CrawlerGasgoo;
import com.ynr.crawler.haier.access.service.CrawlerGasgooService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Code Monkey: 何彪 <br>
 * Dev Time: 2020/5/17 <br>
 */
@Slf4j
@Service
@AllArgsConstructor
public class CrawlerGasgooServiceImpl extends ServiceImpl<CrawlerGasgooMapper, CrawlerGasgoo> implements CrawlerGasgooService {
    @Override
    public IPage<CrawlerGasgoo> queryCrawlerGasgooData(String searchTarget, String month, int pageId) {
        Page page = new Page();
        page.setCurrent(pageId);
        page.setSize(1000);
        IPage<CrawlerGasgoo> iPage = null;
        if (searchTarget.equals("all")) {
            iPage = this.baseMapper.selectAllTarget(page,  month);
            log.info("ipage total: {},record: {}",iPage.getTotal(),iPage.getRecords().size());
        } else {
            iPage = this.baseMapper.selectByTarget(page, searchTarget, month);
        }
        if (iPage.getRecords().size() == 0) {
            return iPage;
        }
        List<CrawlerGasgoo> gasgooList = Lists.newArrayList();
        Map<String,List<CrawlerGasgoo>> targetMap =  iPage.getRecords().parallelStream()
                .collect(Collectors.groupingBy(CrawlerGasgoo::getSearchTarget));
        for (Map.Entry<String,List<CrawlerGasgoo>> entry: targetMap.entrySet()) {
            List<String> targetList = entry.getValue().stream()
                    .map(CrawlerGasgoo::getCompany)
                    .collect(Collectors.toList());
            List<CrawlerGasgoo> tmpList = this.baseMapper.selectTargetAttr(entry.getKey(), targetList, month);
            gasgooList.addAll(tmpList);
        }

        iPage.setTotal(iPage.getTotal());
        iPage.setRecords(gasgooList);
        return iPage;
    }
}

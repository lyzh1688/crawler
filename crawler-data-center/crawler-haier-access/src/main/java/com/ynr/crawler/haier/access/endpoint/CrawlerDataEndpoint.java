package com.ynr.crawler.haier.access.endpoint;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.google.common.collect.Maps;
import com.ynr.crawler.haier.access.dto.*;
import com.ynr.crawler.haier.access.model.CrawlerGasgoo;
import com.ynr.crawler.haier.access.model.CrawlerJgjc;
import com.ynr.crawler.haier.access.model.CrawlerPigIndex;
import com.ynr.crawler.haier.access.service.CrawlerGasgooService;
import com.ynr.crawler.haier.access.service.CrawlerJgjcService;
import com.ynr.crawler.haier.access.service.CrawlerPigIndexService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Code Monkey: ºÎ±ë <br>
 * Dev Time: 2020/5/17 <br>
 */
@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/haier")
public class CrawlerDataEndpoint {
    private CrawlerJgjcService crawlerJgjcService;
    private CrawlerPigIndexService crawlerPigIndexService;
    private CrawlerGasgooService crawlerGasgooService;


    @GetMapping("/{crawler}/{target}/{dataDate}")
    public CrawlerJgjcResponse queryJgjcData(@PathVariable("crawler") String crawler,
                                             @PathVariable("target") String target,
                                             @PathVariable("dataDate") String dataDate) {
        log.info("[queryJgjcData] crawler: {},target: {},dataDate: {}", crawler, target, dataDate);
        List<CrawlerJgjc> crawlerJgjcList = this.crawlerJgjcService.queryCrawlerJgjc(crawler, target, dataDate);
        Map<String, Map<String, Map<String, CrawlerJgjcItem>>> payload = new HashMap<>();
//        pork,chicken,egg
        Map<String, List<CrawlerJgjc>> productMap = crawlerJgjcList.stream()
                .collect(Collectors.groupingBy(CrawlerJgjc::getProductType));
//        curWeek,lastWeek,mom
        Map<String, Map<String, CrawlerJgjcItem>> jgjcItemMap = productMap.entrySet()
                .stream()
                .flatMap(entry -> {
                    Map<String, Map<String, CrawlerJgjcItem>> tmpMap = Maps.newHashMap();
                    Map<String, CrawlerJgjcItem> tmpJgjcMap = Maps.newHashMap();
                    for (CrawlerJgjc jgjc : entry.getValue()) {
                        CrawlerJgjcItem item = new CrawlerJgjcItem();
                        item.setBalance(jgjc.getBalance());
                        item.setFodderPrice(jgjc.getFodderPrice());
                        item.setProfitCount(jgjc.getProfitCount());
                        item.setRate(jgjc.getRate());
                        item.setRawPrice(jgjc.getRawPrice());
                        tmpJgjcMap.put(jgjc.getStatType(), item);
                    }
                    tmpMap.put(entry.getKey(), tmpJgjcMap);
                    return tmpMap.entrySet().stream();
                }).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        payload.put("dataDate", jgjcItemMap);
        return new CrawlerJgjcResponse(payload);
    }


    @GetMapping("/{crawler}/{begin}/{end}")
    public CrawlerPigIndexResponse queryPigIndexData(@PathVariable("crawler") String crawler,
                                                     @PathVariable("begin") String begin,
                                                     @PathVariable("end") String end) {
        log.info("[queryPigIndexData] crawler: {},target: {},dataDate: {}", crawler, begin, end);
        List<CrawlerPigIndex> crawlerPigIndexList = crawlerPigIndexService.queryCrawlerPigIndexData(begin, end);
        List<CrawlerPigIndexItem> itemList = crawlerPigIndexList.stream()
                .map(crawlerPigIndex -> {
                    CrawlerPigIndexItem item = new CrawlerPigIndexItem();
                    item.setI(crawlerPigIndex.getIndex());
                    item.setD(crawlerPigIndex.getDataDate());
                    item.setCr(crawlerPigIndex.getChangeRate());
                    item.setC(crawlerPigIndex.getChange());
                    item.setN(crawlerPigIndex.getName());
                    item.setBp(crawlerPigIndex.getBookingPrice());
                    item.setTp(crawlerPigIndex.getTradePrice());
                    item.setAtw(crawlerPigIndex.getAvgTradeWeight());
                    return item;
                }).collect(Collectors.toList());
        CrawlerPigIndexList pigIndexList = new CrawlerPigIndexList();
        pigIndexList.setItems(itemList);
        return new CrawlerPigIndexResponse(pigIndexList);
    }

    @GetMapping("/{crawler}/{searchTarget}/{month}/page/{pageId}")
    public CrawlerGasgooResponse queryGasgooData(@PathVariable("crawler") String crawler,
                                                 @PathVariable("searchTarget") String searchTarget,
                                                 @PathVariable("month") String month,
                                                 @PathVariable("pageId") int pageId) {
        log.info("[queryGasgooData] crawler: {},searchTarget: {},month: {},pageId: {}", crawler, searchTarget, month, pageId);
        IPage<CrawlerGasgoo> pageResult = this.crawlerGasgooService.queryCrawlerGasgooData(searchTarget, month, pageId);
        List<CrawlerGasgoo> crawlerGasgooList = pageResult.getRecords();
        long totalCnt = pageResult.getTotal();
        List<CrawlerGasgooCompany> crawlerGasgooCompanyList = crawlerGasgooList
                .stream()
                .map(crawlerGasgoo -> {
                    CrawlerGasgooCompany company = new CrawlerGasgooCompany();
                    company.setCompany(crawlerGasgoo.getCompany());
                    List<CrawlerGasgooBizItem> items = crawlerGasgoo.getAttrs()
                            .stream()
                            .map(attr -> {
                                CrawlerGasgooBizItem item = new CrawlerGasgooBizItem();
                                item.setK(attr.getAttribute());
                                item.setV(attr.getAttrValue());
                                return item;
                            }).collect(Collectors.toList());
                    company.setBizInfo(items);
                    return company;
                }).collect(Collectors.toList());
        CrawlerGasgooItem crawlerGasgooItem = new CrawlerGasgooItem();
        crawlerGasgooItem.setItems(crawlerGasgooCompanyList);
        crawlerGasgooItem.setSearchTarget(searchTarget);
        crawlerGasgooItem.setTotalCount((int) totalCnt);

        return new CrawlerGasgooResponse(crawlerGasgooItem);
    }
}

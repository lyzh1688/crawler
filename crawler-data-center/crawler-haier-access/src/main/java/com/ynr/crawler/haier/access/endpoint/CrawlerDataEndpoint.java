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
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Code Monkey: �α� <br>
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


    @GetMapping("/jgjc/{target}/{dataDate}")
    public CrawlerJgjcResponse queryJgjcData(@PathVariable("target") String target,
                                             @PathVariable("dataDate") String dataDate) {
        log.info("[queryJgjcData] target: {},dataDate: {}", target, dataDate);
        List<CrawlerJgjc> crawlerJgjcList = this.crawlerJgjcService.queryCrawlerJgjc(target, dataDate);
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


    @GetMapping("/hqb/{begin}/{end}")
    public CrawlerPigIndexResponse queryPigIndexData(@PathVariable("begin") String begin,
                                                     @PathVariable("end") String end) {
        log.info("[queryPigIndexData] target: {},dataDate: {}", begin, end);
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

    @GetMapping("/gasgoo/page")
    public CrawlerGasgooResponse queryGasgooData(@RequestParam("searchTarget") String searchTarget,
                                                 @RequestParam("month") String month,
                                                 @RequestParam("pageId") int pageId,
                                                 @RequestParam("pageSize") int pageSize) {
        log.info("[queryGasgooData] searchTarget: {},month: {},pageId: {},pageSize: {}", searchTarget, month, pageId,pageSize);
        IPage<CrawlerGasgoo> pageResult = this.crawlerGasgooService.queryCrawlerGasgooData(searchTarget, month, pageId,pageSize);
        List<CrawlerGasgoo> crawlerGasgooList = pageResult.getRecords();
        long totalCnt = pageResult.getRecords().size();
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
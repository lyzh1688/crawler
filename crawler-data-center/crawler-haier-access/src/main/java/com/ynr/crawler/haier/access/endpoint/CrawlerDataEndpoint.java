package com.ynr.crawler.haier.access.endpoint;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.ynr.crawler.haier.access.dict.ProductType;
import com.ynr.crawler.haier.access.dto.*;
import com.ynr.crawler.haier.access.model.CrawlerGasgoo;
import com.ynr.crawler.haier.access.model.CrawlerJgjc;
import com.ynr.crawler.haier.access.model.CrawlerPigIndex;
import com.ynr.crawler.haier.access.model.CrawlerQts;
import com.ynr.crawler.haier.access.service.CrawlerGasgooService;
import com.ynr.crawler.haier.access.service.CrawlerJgjcService;
import com.ynr.crawler.haier.access.service.CrawlerPigIndexService;
import com.ynr.crawler.haier.access.service.CrawlerQtsService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
@RequestMapping("/api/haier")
public class CrawlerDataEndpoint {
    private CrawlerJgjcService crawlerJgjcService;
    private CrawlerPigIndexService crawlerPigIndexService;
    private CrawlerGasgooService crawlerGasgooService;
    private CrawlerQtsService crawlerQtsService;


    @GetMapping("/jgjc/{target}/{begin}/{end}")
    public CrawlerJgjcResponse queryJgjcData(@PathVariable("target") String target,
                                             @PathVariable("begin") String begin,
                                             @PathVariable("end") String end) {
        log.info("[queryJgjcData] target: {},begin: {},end: {}", target, begin,end);
        Map<String,List<CrawlerJgjc>> jgjcMap = this.crawlerJgjcService.queryCrawlerJgjc(target, begin,end)
                .stream()
                .collect(Collectors.groupingBy(CrawlerJgjc::getDataDate));
        List<CrawlerJgjcInfo> crawlerJgjcInfoList = Lists.newArrayList();
        for (Map.Entry<String,List<CrawlerJgjc>> dateEntry:jgjcMap.entrySet()) {
            List<CrawlerJgjc> crawlerJgjcList = dateEntry.getValue();
            CrawlerJgjcInfo crawlerJgjcInfo = new CrawlerJgjcInfo();
            if (!crawlerJgjcList.isEmpty()) {
                crawlerJgjcInfo.setDataDate(crawlerJgjcList.get(0).getDataDate());
                crawlerJgjcInfo.setReleaseDate(crawlerJgjcList.get(0).getReleaseDate());
            }
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
            for (Map.Entry<String, Map<String, CrawlerJgjcItem>> entry : jgjcItemMap.entrySet()) {
                ProductType productType = ProductType.valueOfProductType(entry.getKey());
                assert productType != null;
                switch (productType) {
                    case PORK:
                        crawlerJgjcInfo.setPork(entry.getValue());
                        break;
                    case EGG:
                        crawlerJgjcInfo.setEgg(entry.getValue());
                        break;
                    case CHICKEN:
                        crawlerJgjcInfo.setChicken(entry.getValue());
                        break;
                    default:
                        break;
                }
            }
            crawlerJgjcInfoList.add(crawlerJgjcInfo);
        }
        CrawlerJgjcList crawlerJgjcList = new CrawlerJgjcList();
        crawlerJgjcList.setItems(crawlerJgjcInfoList);

        return new CrawlerJgjcResponse(crawlerJgjcList);
    }


    @GetMapping("/hqb/{begin}/{end}")
    public CrawlerPigIndexResponse queryPigIndexData(@PathVariable("begin") String begin,
                                                     @PathVariable("end") String end) {
        log.info("[queryPigIndexData] begin: {},end: {}", begin, end);
        List<CrawlerPigIndex> crawlerPigIndexList = crawlerPigIndexService.queryCrawlerPigIndexData(begin, end);
        List<CrawlerPigIndexItem> itemList = crawlerPigIndexList.stream()
                .map(crawlerPigIndex -> {
                    CrawlerPigIndexItem item = new CrawlerPigIndexItem();
                    item.setI(crawlerPigIndex.getIndex());
                    item.setD(crawlerPigIndex.getDataDate());
                    item.setCr(crawlerPigIndex.getChangeRate());
                    item.setC(crawlerPigIndex.getChange());
                    item.setR(crawlerPigIndex.getRegion());
                    item.setBp(crawlerPigIndex.getBookingPrice());
                    item.setTp(crawlerPigIndex.getTradePrice());
                    item.setAtw(crawlerPigIndex.getAvgTradeWeight());
                    return item;
                }).collect(Collectors.toList());
        CrawlerPigIndexList pigIndexList = new CrawlerPigIndexList();
        pigIndexList.setItems(itemList);
        return new CrawlerPigIndexResponse(pigIndexList);
    }

    @GetMapping("/gasgoo/{searchTarget}/{month}/page/{pageId}")
    public CrawlerGasgooResponse queryGasgooData(@PathVariable("searchTarget") String searchTarget,
                                                 @PathVariable("month") String month,
                                                 @PathVariable("pageId") int pageId) {
        log.info("[queryGasgooData] searchTarget: {},month: {},pageId: {}", searchTarget, month, pageId);
        IPage<CrawlerGasgoo> pageResult = this.crawlerGasgooService.queryCrawlerGasgooData(searchTarget, month, pageId);
        List<CrawlerGasgoo> crawlerGasgooList = pageResult.getRecords();
        long totalCnt = pageResult.getTotal();
        List<CrawlerGasgooCompany> crawlerGasgooCompanyList = crawlerGasgooList
                .stream()
                .map(crawlerGasgoo -> {
                    CrawlerGasgooCompany company = new CrawlerGasgooCompany();
                    company.setCompany(crawlerGasgoo.getCompany());
                    company.setAutomaker(crawlerGasgoo.getSearchTarget());
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
        crawlerGasgooItem.setTotalCnt((int) totalCnt);

        return new CrawlerGasgooResponse(crawlerGasgooItem);
    }

    @GetMapping("/qts/{month}/page/{pageId}")
    public CrawlerQtsResponse queryQtsData(@PathVariable("month") String month,
                                           @PathVariable("pageId") int pageId) {
        log.info("[queryQtsData] month: {},pageId: {}", month, pageId);
        IPage<CrawlerQts> page = this.crawlerQtsService.queryCrawlerQtsData(month, pageId);
        List<CrawlerQtsCompany> crawlerQtsCompanyList = page.getRecords()
                .stream()
                .map(qts -> {
                    CrawlerQtsCompany crawlerQtsCompany = new CrawlerQtsCompany();
                    crawlerQtsCompany.setCompany(qts.getCompany());
                    crawlerQtsCompany.setProdType(qts.getProdtype());
                    crawlerQtsCompany.setRule(qts.getRule());
                    crawlerQtsCompany.setUnit(qts.getUnit());
                    crawlerQtsCompany.setSpecs(qts.getSpecs());
                    crawlerQtsCompany.setCertificationID(qts.getCertificationid());
                    crawlerQtsCompany.setCertDate(qts.getCertdate());
                    crawlerQtsCompany.setExpireDate(qts.getExpiredate());
                    crawlerQtsCompany.setStatus(qts.getStatus());
                    crawlerQtsCompany.setIsCancled(qts.getIscancled());
                    return crawlerQtsCompany;
                }).collect(Collectors.toList());
        CrawlerQtsItem crawlerQtsItem = new CrawlerQtsItem();
        crawlerQtsItem.setItems(crawlerQtsCompanyList);
        crawlerQtsItem.setTotalCnt((int) page.getTotal());
        return new CrawlerQtsResponse(crawlerQtsItem);
    }
}

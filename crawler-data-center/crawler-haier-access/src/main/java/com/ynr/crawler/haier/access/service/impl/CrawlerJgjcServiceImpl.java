package com.ynr.crawler.haier.access.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ynr.crawler.haier.access.dao.CrawlerJgjcMapper;
import com.ynr.crawler.haier.access.model.CrawlerJgjc;
import com.ynr.crawler.haier.access.service.CrawlerJgjcService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Code Monkey: 何彪 <br>
 * Dev Time: 2020/5/17 <br>
 */
@Service
@AllArgsConstructor
public class CrawlerJgjcServiceImpl extends ServiceImpl<CrawlerJgjcMapper, CrawlerJgjc> implements CrawlerJgjcService {

    @Override
    public List<CrawlerJgjc> queryCrawlerJgjc(String target, String begin,String end) {
        if (target.equals("all")) {
            return this.list(Wrappers.<CrawlerJgjc>query().lambda().ge(CrawlerJgjc::getDataDate, begin)
            .le(CrawlerJgjc::getDataDate, end));
        }
        return this.list(Wrappers.<CrawlerJgjc>query().lambda().eq(CrawlerJgjc::getProductType, target)
                .ge(CrawlerJgjc::getDataDate, begin)
                .le(CrawlerJgjc::getDataDate, end));
    }
}

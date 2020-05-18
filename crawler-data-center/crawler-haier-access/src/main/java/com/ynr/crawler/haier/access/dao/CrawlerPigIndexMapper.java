package com.ynr.crawler.haier.access.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ynr.crawler.haier.access.model.CrawlerPigIndex;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CrawlerPigIndexMapper extends BaseMapper<CrawlerPigIndex> {
    List<CrawlerPigIndex> selectByDate(@Param("beginDate") String beginDate, @Param("endDate") String endDate);
}
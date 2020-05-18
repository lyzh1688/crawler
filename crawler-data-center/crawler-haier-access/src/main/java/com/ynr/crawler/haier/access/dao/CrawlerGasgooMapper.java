package com.ynr.crawler.haier.access.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ynr.crawler.haier.access.model.CrawlerGasgoo;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CrawlerGasgooMapper extends BaseMapper<CrawlerGasgoo> {

    IPage<CrawlerGasgoo> selectByTarget(Page page, @Param("searchTarget") String serachTarget, @Param("month") String month);

    List<CrawlerGasgoo> selectTargetAttr(@Param("searchTarget") String serachTarget, @Param("list") List<String> companyNames, @Param("month") String month);


}
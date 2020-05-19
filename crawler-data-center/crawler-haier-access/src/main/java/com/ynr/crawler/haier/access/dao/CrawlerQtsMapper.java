package com.ynr.crawler.haier.access.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ynr.crawler.haier.access.model.CrawlerQts;
import org.apache.ibatis.annotations.Param;

public interface CrawlerQtsMapper extends BaseMapper<CrawlerQts> {

    IPage<CrawlerQts> selectCrawlerQtsByPage(Page page, @Param("month") String month);
}
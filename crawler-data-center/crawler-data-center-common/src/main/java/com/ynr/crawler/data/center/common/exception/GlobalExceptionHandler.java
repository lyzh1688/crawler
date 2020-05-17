package com.ynr.crawler.data.center.common.exception;

import com.ynr.crawler.data.center.common.CrawlerResponse;
import com.ynr.crawler.data.center.common.RetCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Code Monkey: 何彪 <br>
 * Dev Time: 2019/07/11 <br>
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    /**
     * 全局异常.
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public CrawlerResponse handleGlobalException(Exception e) {
        log.error("INTERNAL_SERVER_ERROR: {}", e);
        return CrawlerResponse.builder()
                .retCode(RetCode.SYS_ERROR)
                .retInfo(e.getLocalizedMessage())
                .build();
    }

    /**
     * validation Exception
     */
    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public CrawlerResponse handleBodyValidException(MethodArgumentNotValidException exception) {
        log.error("HttpStatus.BAD_REQUEST: {}", exception);
        return CrawlerResponse.builder()
                .retCode(RetCode.UN_SUPPORTED_METHOD)
                .retInfo(exception.getLocalizedMessage())
                .build();
    }

}

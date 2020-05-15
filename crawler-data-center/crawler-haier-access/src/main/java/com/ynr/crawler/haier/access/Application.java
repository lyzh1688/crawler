package com.ynr.crawler.haier.access;

import net.hasor.spring.boot.EnableHasor;
import net.hasor.spring.boot.EnableHasorWeb;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Created by 刘悦之 on 2020/5/15.
 */
//@EnableHasor()
//@EnableHasorWeb()
@SpringBootApplication()
public class Application {
    public static void main(String args[]) {
        SpringApplication.run(Application.class, args);
    }
}

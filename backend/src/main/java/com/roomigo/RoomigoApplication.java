package com.roomigo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RoomigoApplication {

    public static void main(String[] args) {
        SpringApplication.run(RoomigoApplication.class, args);
    }
}

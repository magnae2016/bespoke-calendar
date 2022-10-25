"use strict";
import * as C from "./constant.js";
import moment from "moment";

const parseLocale = (preset) => {
    if (typeof preset === "object") return preset;
    // TODO typeof preset === "string"
};

const calendar = function (c) {
    const cfg = typeof c === "object" ? c : {};
    cfg.args = arguments;

    return new Calendar(cfg);
};

class Year {
    constructor() {}
}

class Month {
    constructor() {}
}

class Week {
    constructor() {}

    // Generator 함수
    static nextTick() {
        yield;
    }
}

class Day {
    constructor() {}
}

class Calendar {
    constructor(cfg) {
        this.$L = parseLocale(cfg.locale);
        this.$calendar = new Map();
        this.$y = [];
        this.parse(cfg);
    }

    parse(cfg) {
        // TODO cfg 기반으로 config 설정
        const { $L } = this;

        // Check for 12 months data by year
        const monthsInYear = {};
        for (const locale of $L) {
            const [$y] = locale.split(",");
            if (!($y in monthsInYear)) {
                monthsInYear[$y] = 0;
            }
            monthsInYear[$y]++;
        }

        // TODO ERR_NOT_ENOUGH_DATA 처리
        for (const [key, value] of Object.entries(monthsInYear)) {
            if (value === 12) {
                this.$y.push(key);
                this.$calendar.set(
                    key,
                    new Array(C.MONTHS + 1).fill(new Map())
                );
            } else console.log(C.ERR_NOT_ENOUGH_DATA);
        }

        console.log(this.$calendar);
        if (this.$y.length) this.init();
        else console.error(C.ERR_NOT_ENOUGH_DATA);
    }

    init() {
        const { $L } = this;
        for (const locale of $L) {
            // Add Year, Month, Week, Day
            const [$y, $M, $SW, $EW, $SD, $ED] = locale.split(",");
            console.log($y, $M, $SW, $EW, $SD, $ED);
            // week 객체를 만들어서
            // next를 호출하면 for문을 돌릴 수 있도록 처리가 필요함
            const month = this.$calendar.get($y)[$M];

            const days = [];
            for (const add of Array.from(Array(C.DAYS).keys())) {
                const adding = moment($SD, "M/D/YYYY").add(add, "d");
                days.push(adding);
            }
            month.set($SW, days);
        }
        console.log(this.$calendar);
    }
}

export default calendar;

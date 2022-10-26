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
    constructor(weekNumber, weekStartDay) {
        this.$weekNumber = weekNumber;
        this.$weekStartDay = weekStartDay;
        this.weekNumber = weekNumber;
        this.daysOfWeek = [];
        this.parse();
        this.spreadDays();
    }

    parse() {
        if ([52, 53].includes(this.weekNumber)) {
            this.weekNumber = 0;
        }
    }

    spreadDays() {
        for (const add of Array.from(Array(C.DAYS).keys())) {
            const adding = moment(this.$weekStartDay, "M/D/YYYY")
                .add(add, "d")
                .format("YYYYMMDD");
            this.daysOfWeek.push(adding);
        }
    }

    nextWeek() {
        const lastDay = this.daysOfWeek.at(-1);
        const nextWeekStartDay = moment(lastDay).add(1, "d");
        return new Week(++this.weekNumber, nextWeekStartDay);
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
                    new Array(C.MONTHS + 1).fill(null).map(function () {
                        return new Map();
                    })
                );
            } else console.log(C.ERR_NOT_ENOUGH_DATA);
        }

        if (this.$y.length) this.init();
        else console.error(C.ERR_NOT_ENOUGH_DATA);
    }

    init() {
        const { $L } = this;
        for (const locale of $L) {
            // Add Year, Month, Week, Day
            const [$y, $M, $SW, $EW, $SD, $ED] = locale.split(",");
            console.log($y, $M, $SW, $EW, $SD, $ED);

            const month = this.$calendar.get($y)[$M];
            let sw = Number($SW.substring(1));
            const ew = Number($EW.substring(1));
            let week = new Week(sw, $SD);
            do {
                //
                const W = week.$weekNumber;
                const D = week.daysOfWeek;
                month.set(W, D);
                //
                week = week.nextWeek();
                sw = week.$weekNumber;
            } while (sw <= ew);
        }
        // console.log(this.$calendar);
    }
}

export default calendar;

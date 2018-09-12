var HTMLperiod = document.getElementsByClassName("period")[0],
    HTMLhours = document.getElementsByClassName("hours")[0],
    HTMLminutes = document.getElementsByClassName("minutes")[0],
    HTMLseconds = document.getElementsByClassName("seconds")[0],
    nextBellTime = [0,0,0], //h,m,s
    currentPeriod, //periods[x]
    currentTime = [0,0,0], //h,m,s
    dayStartTime = [7,30,00],
    dayEndTime = [16,15,00];

var beforeDayStart = [
        dayStartTime[0],
        dayStartTime[1] - 1,
        dayStartTime[2]
    ],
    afterDayEnd = [
        dayEndTime[0],
        dayEndTime[1] + 1,
        dayEndTime[2]
    ]

const periods = [
    {
        name: "morning class",
        startTime: dayStartTime,
        endTime: [8,9,00],
        length: 39,
    },
    {
        name: "Period 1",
        startTime: [8,30,00],
        endTime: [9,23,00],
        length: 53,
    },
    {
        name: "Period 2",
        startTime: [9,24,00],
        endTime: [10,17,00],
        length: 53,
    },
    {
        name: "Recess",
        startTime: [10,18,00],
        endTime: [10,35,00],
        length: 17,
    },
    {
        name: "Tutor/assembly/chapel",
        startTime: [10,36,00],
        endTime: [11,03,00],
        length: 53,
    },
    {
        name: "Period 3",
        startTime: [11,04,00],
        endTime: [11,57,00],
        length: 53,
    },
    {
        name: "Period 4",
        startTime: [11,58,00],
        endTime: [12,51,00],
        length: 53,
    },
    {
        name: "Lunch",
        startTime: [12,52,00],
        endTime: [13,31,00],
        length: 39,
    },
    {
        name: "Period 5",
        startTime: [13,32,00],
        endTime: [14,25,00],
        length: 53,
    },
    {
        name: "Period 6",
        startTime: [14,26,00],
        endTime: [15,20,00],
        length: 54,
    },
    {
        name: "Afternoon class",
        startTime: [15,21,00],
        endTime: dayEndTime,
        length: 54,
    }
]
const periodFromTime = function(t) {
    let [h,m,s] = [t[0], t[1], t[2]]
    for (let i = 0; i < periods.length; i++){
        if ((h > periods[i].startTime[0] && m > periods[i].startTime[1]) && 
            (h < periods[i].endTime[0]   && m < periods[i].endTime[1])) {
            return periods[0]
        } else {
            return {
                name: "Not school time",
                startTime: afterDayEnd,
                endTime: beforeDayStart,
            }
        }
    }
}

const setCurrentTime = function(){
    let d = new Date();
    currentTime[0] = d.getHours(),
    currentTime[1] = d.getMinutes(),
    currentTime[2] = d.getSeconds();
}

const setCurrentPeriod = function(){
    currentPeriod = periodFromTime(currentTime);
}

const timeToSeconds = function(t) {
    let seconds = 0;
    seconds += t[0] * 3600; //hours to seconds
    seconds += t[1] * 60; //minutes to seconds
    seconds += t[2] //seconds
    return seconds
}

const secondsToTime = function(seconds) {
    let remaining = seconds;
    let h = Math.floor(remaining / 3600); //whole hours
    remaining -= h * 3600;
    let m = Math.floor(remaining / 60); //whole minutes
    remaining -= m * 60;
    let s = remaining; //seconds 
    return [h,m,s]
}

const calcTimeDifference = function(t1, t2) {
    s1 = timeToSeconds(t1);
    s2 = timeToSeconds(t2);
    secondsBetween = Math.abs(s2 - s1);
    timeBetween = secondsToTime(secondsBetween);
    return timeBetween;
}

const getNextPeriod = function(current) {
    let currentEndTime = currentPeriod.endTime;
    currentEndTime[1]++
    return periodFromTime(currentEndTime);
}
//fire every second
const ticker = setInterval( function(){
    setCurrentTime();
    setCurrentPeriod();

    let next = getNextPeriod();
    let nextStartTime = (next.endTime == beforeDayStart ? next.endTime : nextStartTime);

    let timeLeft = calcTimeDifference(currentTime, nextStartTime);
    let [h,m,s] = timeLeft;

    HTMLperiod.innerHTML = currentPeriod.name;
    HTMLhours.innerHTML = ('0' + h).slice(-2);
    HTMLminutes.innerHTML = ('0' + m).slice(-2);
    HTMLseconds.innerHTML = ('0' + s).slice(-2);
}, 1000)

// const setHTMLperiod = function () {
//     HTMLPeriod.innerHTML = currentPeriod.name
// }
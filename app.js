Notification.requestPermission().then(function(result) {
    console.log("notification permission granted");
  });

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
        name: "A morning class",
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
        name: "A late class",
        startTime: [15,21,00],
        endTime: dayEndTime,
        length: 54,
    }
]
const periodFromTime = function(t) {
    let timeSeconds = timeToSeconds(t);
    for (let i = 0; i < periods.length; i++){
        if ( (timeSeconds >= timeToSeconds(periods[i].startTime)) && 
             (timeSeconds <= timeToSeconds(periods[i].endTime)) ) {
            return periods[i]
        }
    }
    if ( (timeSeconds >= timeToSeconds(periods[0].endTime)) && 
         (timeSeconds <= timeToSeconds(periods[1].startTime)) ) {
            return {
                name: "Before period 1",
                startTime: [periods[0].endTime[0],
                            periods[0].endTime[1] + 1,
                            periods[0].endTime[2]],
                endTime: [periods[1].endTime[0],
                          periods[1].endTime[1] - 1,
                          periods[1].endTime[2]],
            }
    }
    return {
        name: "Not school time",
        startTime: afterDayEnd,
        endTime: beforeDayStart,
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
    remaining %= 3600;
    let m = Math.floor(remaining / 60); //whole minutes
    remaining %= 60;
    let s = remaining; //seconds 
    return [h,m,s]
}

const calcTimeDifference = function(t1, t2) {
    s1 = timeToSeconds(t1);
    s2 = timeToSeconds(t2);
    secondsBetween = Math.abs(s1 - s2);
    timeBetween = secondsToTime(secondsBetween);
    return timeBetween;
}

const getNextPeriod = function(current) {
    let currentEndTime = currentPeriod.endTime;
    let nextPeriodStartTime = [
        currentEndTime[0],
        currentEndTime[1] + 1,
        currentEndTime[2]
    ]
    return periodFromTime(nextPeriodStartTime);
}
//fire every second
const ticker = setInterval( function(){
    setCurrentTime();
    setCurrentPeriod();

    let next = getNextPeriod();
    let h,m,s;
    if (currentPeriod.endTime == beforeDayStart && currentTime[0] >= afterDayEnd[0]) {
        let nextStartTime = next.startTime;
        let nowToMid = calcTimeDifference(currentTime, [23,59,59])
        let midToNow = calcTimeDifference([0,0,0], nextStartTime);
        [h,m,s] = secondsToTime(
            timeToSeconds(nowToMid) + timeToSeconds(midToNow)
        );

    } else {
        let nextStartTime = next.startTime;
        let timeLeft = calcTimeDifference(currentTime, nextStartTime);
        [h,m,s] = timeLeft;

    }
    sLeft = timeToSeconds([h,m,s]);
    switch (sLeft) {
        case 600: //10 mins
            var ten = new Notification("10 minutes until " + next.name);
            break;
        case 300: //5 mins
            ten.close.bind(ten)
            var five = new Notification("5 minutes until " + next.name);
            break;
        case 60: //1 min
            five.close.bind(five)
            var one = new Notification("1 minute until " + next.name);
            break;
        case 0: //done
            one.close.bind(one)
            break;
    }

    HTMLperiod.innerHTML = currentPeriod.name;
    HTMLhours.innerHTML = ('0' + h).slice(-2);
    HTMLminutes.innerHTML = ('0' + m).slice(-2);
    HTMLseconds.innerHTML = ('0' + s).slice(-2);
}, 1000)

// const setHTMLperiod = function () {
//     HTMLPeriod.innerHTML = currentPeriod.name
// }
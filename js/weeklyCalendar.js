/**
 * 周历控件
 * @param container {string} 必选,容器选择器
 * @param options.days{Number} 必填,显示天数
 * @param options.defaultDate {date}  可选,默认为当前年月日
 * @param options.clickDate {function} 点击日期的回调，携带参数为对象形式,包含年月日
 * @param options.getSelectedDate {function} 获取选中的值,默认获取当天日期,携带参数为对象形式,包含年月日
 */
function weeklyCalendar(container, options) {
    var options = options || {};
    console.log(container)

    /*简化选择器操作*/
    var $$ = function(selector) {
        return document.querySelector(container + ' [role=' + selector + ']');
    }
    /**
     * 补零
     */
    var zeroize = function(n) {
        var r = (n < 10 ? "0" + n : n);
        return r
    };

    var d = options['defaultDate'] ? new Date(options['defaultDate']) : new Date();
    var activeDay = d.getDay(),
        activeDate = zeroize(d.getDate()),
        activeMonth = zeroize(d.getMonth() + 1),
        activeYear = d.getFullYear();
    var lis = $$('weeklyCanlendarView').getElementsByTagName('li'),
        aTags = $$('weeklyCanlendarView').getElementsByTagName('a');

    /**
     * 计算过去或者是未来时间
     * @param {return} obj 返回的月份和日期  
     * @param {number} num 过去或者是未来的某天
     */
    var calcTime = function(num) {
        var num = num || 0,
            someTime = d.getTime() + (24 * 60 * 60 * 1000) * num,
            someYear = new Date(someTime).getFullYear(),
            someMonth = zeroize(new Date(someTime).getMonth() + 1), //未来月
            someDate = zeroize(new Date(someTime).getDate()); //未来天
        var obj = {
            "year": someYear,
            "month": someMonth,
            "date": someDate
        };
        return obj;
    }

    /**
     * 设置星期
     * @param {[return]} str 返回星期
     */
    var setWeekDay = function(str){
        var d = new Date();
        var yy = d.getFullYear();
        var firstDay = new Date(str).getDay();
        var weekStr = ['日','一','二','三','四','五','六'];
        return weekStr[firstDay];
    }

    /**
     * 创建周历
     * @param some {Number} 星期几
     */
    var creatWeekCalendar = function(some) {
        var _d = new Date();
        var currDate = zeroize(_d.getDate()),
            currMonth = zeroize(_d.getMonth() + 1),
            currYear = _d.getFullYear();
        var a = '';
        for (var i = some, len = some + options.days; i < len; i++) {
            //当天日期
            if (calcTime(i).year === currYear && calcTime(i).month === currMonth && calcTime(i).date === currDate) {
                a += '<li class="date_box active" data-role="active"><a href="javascript:;" data-year="' + calcTime(i).year + '" data-month="' + calcTime(i).month + '" data-date="' + calcTime(i).date + '"  title="' + calcTime(i).month + '月"><p class="date">' + calcTime(i).month + '-' + calcTime(i).date + '</p><p class="week">周'+setWeekDay(calcTime(i).year+'/'+ calcTime(i).month+'/'+ calcTime(i).date)+'</p></a></li>';
            } else if //选中的日期
            (calcTime(i).year === activeYear && calcTime(i).month === activeMonth && calcTime(i).date === activeDate) {
                a += '<li class="date_box clickActive"><a href="javascript:;" data-year="' + calcTime(i).year + '" data-month="' + calcTime(i).month + '" data-date="' + calcTime(i).date + '" title="' + calcTime(i).month + '月"><p class="date">' + calcTime(i).month + '-' + calcTime(i).date + '</p><p class="week">周'+setWeekDay(calcTime(i).year+'/'+ calcTime(i).month+'/'+ calcTime(i).date)+'</p></a></li>';
            } else {
                a += '<li class="date_box"><a href="javascript:;" data-year="' + calcTime(i).year + '" data-month="' + calcTime(i).month + '" data-date="' + calcTime(i).date + '" title="' + calcTime(i).month + '月"><p class="date">' + calcTime(i).month + '-' + calcTime(i).date + '</p><p class="week">周'+setWeekDay(calcTime(i).year+'/'+ calcTime(i).month+'/'+ calcTime(i).date)+'</p></a></li>';
            }
        };
        $$('weeklyCanlendarView').innerHTML = a;
    }

    /*设置禁用日期*/
    var setDisabled = function() {
        var arr = options['disabledDate'] || []; //禁用日期数组
        var splitArr = null,
            arrYear = null,
            arrMonth = null,
            arrDate = null;
        var maxLen = 31;
        if (arr.length > maxLen) {
            throw new Error('不可选日期天数限制' + maxLen + '天内')
        }
        //禁用的日期
        if (arr.length) {
            for (var index = 0; index < arr.length; index++) {
                splitArr = arr[index].split('-');
                arrYear = splitArr[0];
                arrMonth = splitArr[1];
                arrDate = splitArr[2];
                for (var j = 0; j < aTags.length; j++) {
                    if ((arrYear === aTags[j].dataset.year) && (arrMonth === aTags[j].dataset.month) && (arrDate === aTags[j].dataset.date)) {
                        aTags[j].classList.add('disabled')
                    }
                }
            }
        }
    }

     /*选择日期*/
    var selectedYear = null,
        selectedMonth = null,
        selectedDate = null,
        selectedDateTime = {};
    var  bindClick = function(){
        var dateList = $$('weeklyCanlendarView').querySelectorAll('li');
        if(dateList.length>0){
            for(var i=0; i<dateList.length; i++){
                (function(i){
                    dateList[i].onclick = function(){
                        for(var j=0; j<dateList.length; j++){
                            if(dateList[j].className.indexOf('active')!=-1){
                                dateList[j].classList.remove('active');
                            }
                        }
                        dateList[i].classList.add('active');
                        selectedYear = dateList[i].querySelector('a').getAttribute('data-year');
                        selectedMonth =dateList[i].querySelector('a').getAttribute('data-month');
                        selectedDate = dateList[i].querySelector('a').getAttribute('data-date');
                        selectedDateTime = {
                            "year": selectedYear,
                            "month": selectedMonth,
                            "date": selectedDate
                        }
                        options['clickDate'] && options['clickDate'](selectedDateTime);
                        options['getSelectedDate'] && options['getSelectedDate'](selectedDateTime);
                    }
                })(i)
            }
        }
    }


    /*初始化周历*/
    var initDatetime = function() {
        creatWeekCalendar(-activeDay);
        setDisabled();
        bindClick();
    }()

    //设置初始点击次数
    $$('weeklyCanlendarView').setAttribute('clickedTimes', 0);
    //获取点击次数
    var clickedTimes = $$('weeklyCanlendarView').getAttribute('clickedTimes');
    var weekNum = $$('week_selector').getAttribute('week');
    /*前一周和后一周方法*/
    var changeWeek = function(clickedTimes, weekNum) {
        creatWeekCalendar(-activeDay - (options.days* clickedTimes));
        $$('weeklyCanlendarView').setAttribute('clickedTimes', clickedTimes);
        setDisabled();
        //动态设置周，周设置属性，仅作为点击前一周和后一周计算的时候显示周视图
        $$('week_selector').innerHTML = weekNum;
        $$('week_selector').setAttribute('week', weekNum);
        bindClick();
    }

    var n = 0;
    var timer = null;

    /*前一周*/
    $$('prev_week').onclick = function() {
        clickedTimes++;
        weekNum--;
        changeWeek(clickedTimes, weekNum);
        timer = setInterval(function(){
            if(n>800){
                clearInterval(timer);
                $$('weeklyCanlendarView').style.left =0;
                timer = null;
                n = 0;
            }else{
                n+=10;
                $$('weeklyCanlendarView').style.left = n+'px';
            }
        },5);
    }

    /*后一周*/
    $$('next_week').onclick = function() {
        clickedTimes--;
        weekNum++;
        changeWeek(clickedTimes, weekNum);
        timer = setInterval(function(){
            if(n>800){
                clearInterval(timer);
                $$('weeklyCanlendarView').style.left =0;
                timer = null;
                n = 0;
            }else{
                n+=10;
                $$('weeklyCanlendarView').style.left = -n+'px';
            }
        },5);
    }
    
    if (!selectedYear) {
        selectedDateTime = {
            "year": activeYear,
            "month": activeMonth,
            "date": activeDate
        }
        options['getSelectedDate'] && options['getSelectedDate'](selectedDateTime)
    }
}
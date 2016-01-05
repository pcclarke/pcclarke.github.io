/*************************************
CONSTANTS
**************************************/
var minsPerDay = 1440 ;
var maxMETS = 100 ;     // METS 0..10  * 10 from fitbit

var minBoutMins = 8 ;       // minimum bout length in minutes
var maxBoutMins = 20 ;      // maximum allowable bout length in minutes
var maxBoutBreakMins = 1 ;  // maximum small rest allowed during bouts in minutes
var minBoutInterval = 60 ;  // minimum time between bouts in minutes
var minBoutMETS = 24 ;      // minimum METS required to have a bout
var maxBoutMETS = 50 ;      // maximum avg METS allowable in a bout
var maxInactiveMins = 60;   // maximum time 'allowed' for inactivity
var minSedentaryMins = 20;

var margin = 50 ;
var drawHeight = 500 ;
var drawWidth = 1050 ;

var width  = drawWidth + margin + 10 ,  
    height = drawHeight + margin,
    barWidth = 1 ;

var xScaledTr = d3.scale.linear()   // scale and translate
    .domain( [0, minsPerDay ] )
    .range( [margin, drawWidth + margin ] ) ;

var xScaled = d3.scale.linear()     // scale only
    .domain( [0, minsPerDay ] )
    .range( [0, drawWidth] ) ;

var xScaledTrHours = d3.scale.linear()  // scale and translate
    .domain( [0, 24 ] )
    .range( [margin, drawWidth + margin ] ) ;

var xAxis = d3.svg.axis()
    .scale( xScaledTrHours )
    .orient( "bottom" );

var yScaled = d3.scale.linear()
    .domain( [0, maxMETS ] )
    .range( [0, drawHeight ] );
var yScaledFlip = d3.scale.linear()
    .domain( [0, maxMETS/10 ] )     // 8 METS = 80 from fitbit 
    .range( [ drawHeight, 0 ] );

var yAxis = d3.svg.axis();
    yAxis.scale( yScaledFlip)
         .orient( "left" );

var chart = d3.select( ".chart" )
    .attr( "width", width) 
    .attr( "height", height) ;


/////   Input management linking Form to actions (changeClr and PrevNext are nfter the d3.tsv call
d3.selectAll("input[name=reference]")
    .on("change", changeClr );

d3.selectAll("button[name=reference]")
    .on("click", PrevNext );

///// Append classes to the chart that we'll bind data to
var wash         = chart.append( "g" ).attr( "class", "wash" );
var sedentaryLbl = wash.append( "g" ).attr( "class", "sedentaryLbl" );     // wash and label for sedentary
var lightLbl     = wash.append( "g" ).attr( "class", "lightLbl" );     // wash and label for light activity
var mediumLbl    = wash.append( "g" ).attr( "class", "mediumLbl" );        // wash and label for moderate activity
var highLbl      = wash.append( "g" ).attr( "class", "highLbl" );      // wash and label for Vigorous activity
var chartMETS = chart.append( "g" ).attr( "class", "chartMETS" );
var chartTenMinutes = chart.append( "g" ).attr( "class", "chartTenMinutes" );
var chartSmiley = chart.append( "g" ).attr( "class", "chartSmiley" );
var chartSleep = chart.append( "g" ).attr( "class", "chartSleep" );
var chartBouts = chart.append( "g" ).attr( "class", "chartBouts" );
var chartBoutsTAct = chart.append( "g" ).attr( "class", "chartBoutsTAct" ); // Bout too active (excess METS)
var chartBoutsTLong = chart.append( "g" ).attr( "class", "chartBoutsTLong" );   // Bout too long (excess minutes)
var chartBoutsTSoon = chart.append( "g" ).attr( "class", "chartBoutsTSoon" );   // Bout too soon after prev bout

///// Colours
var metsRGBA       = [ 128, 128, 128, 0.6 ] ;
var subMetsRGBA    = [ 237,  28,  36,   1 ] ;
var metsTenRGBA    = [ 128, 128, 128, 0.6 ] ;
var boutsRGBA      = [ 0, 182,  83,   1 ] ;
//var boutsRGBA      = [   0, 248,  61,   1 ] ;
var boutsTActRGBA  = [ 240,  80,  80, 0.4 ] ;
var boutsTLongRGBA = [ 140, 120, 180, 0.4 ] ;
var boutsTSoonRGBA = [ 128, 128,  64, 0.8 ] ;
var inactivityRGBA = [ 0, 54,  25,   1 ] ;
var shadowOverlay  = [   0,   0,   0, 0.1 ] ;
var white          = [ 255, 255, 255,   1 ] ;
subMetsRGBA = doRGBAlpha( subMetsRGBA, 0.2) ;
shadowOverlay = doRGBAlpha( shadowOverlay, 0.1) ;

///// Options
var drawchartMETS = false ;
var drawchartTenMinutes = false ;
var drawchartSmiley = true;
var drawchartSleep = true;
var drawchartBouts = true;
var drawchartBoutsTAct = true;
var drawchartBoutsTLong = true;
var drawchartBoutsTSoon = true;

var username = "patrick clarke";
if (getGetParameters()["name"]) {
    username = getGetParameters()["name"];  
}

///// Setup the day
var year = 2015;
var month = 3; // January = 0
var day = 30;

var dayToDraw = new Date();
dayToDraw.setFullYear(year);
dayToDraw.setMonth(month);
dayToDraw.setDate(day);

var nextDay = new Date();
nextDay.setFullYear(year);
nextDay.setMonth(month);
nextDay.setDate(++day);

DrawWash();
///// Big drawing stuff function
goVisualize(dayToDraw, nextDay);


/*****************************
LOAD DATA
*****************************/

function goVisualize(today, tomorrow) {
    var drawDayFilename = makeFilename( username, today, "" );
    var drawSleepDayFilename = makeSleepFilename( username, today, "_sleep" );
    var nextSleepDayFilename = makeSleepFilename( username, tomorrow, "_sleep" );
    loadPrevSleep(drawDayFilename, drawSleepDayFilename, nextSleepDayFilename);
}

function makeFilename( id, theDate )
{
    var split = id.split(' ');
    var firstName = split[0];
    var lastName = split[1];

    var str = id +"_" + theDate.getFullYear() + "-";
    if( (theDate.getMonth() + 1)  >= 10 )
        str += (theDate.getMonth() + 1) + "-" ;
    else
        str += "0" + (theDate.getMonth() + 1) + "-" ;
    if(theDate.getDate()  >= 10 )
        str += theDate.getDate() ;
    else
        str += "0" + theDate.getDate() ;
    str += ".json"
    return( str ) ;
}

function makeSleepFilename( id, theDate )
{
    var split = id.split(' ');
    var firstName = split[0];
    var lastName = split[1];

    var str =  id +"_" + theDate.getFullYear() + "-";
    if( (theDate.getMonth() + 1)  >= 10 )
        str += (theDate.getMonth() + 1) + "-" ;
    else
        str += "0" + (theDate.getMonth() + 1) + "-" ;
    if(theDate.getDate()  >= 10 )
        str += theDate.getDate() ;
    else
        str += "0" + theDate.getDate() ;
    str += "_sleep";
    str += ".json"
    return( str ) ;
}

function loadPrevSleep(calFilename, prevSleepFilename, nextSleepFilename) {
    d3.json( prevSleepFilename, function(error, prevSleep) {
        var startDate = new Date(Date.parse(prevSleep["sleep"][0]["startTime"]));
        var sleepMinuteData = prevSleep["sleep"][0]["minuteData"];
        
        var startTime = 0;
        if (startDate.getDate() == day) {
            startTimeString = sleepMinuteData[0]["dateTime"];
            startTime = (+(startTimeString.slice(0, 2)) * 60) + +(startTimeString.slice(3, 5));
        }
        
        var endTimeString = sleepMinuteData[sleepMinuteData.length - 1]["dateTime"];
        var endTime = (+(endTimeString.slice(0, 2)) * 60) + +(endTimeString.slice(3, 5));
        
        var sleepData = [];
        sleepData.push(startTime);
        sleepData.push(endTime);

        loadNextSleep(calFilename, sleepData, nextSleepFilename);
    });
}

function loadNextSleep(calFilename, sleepData, nextSleepFilename) {
    d3.json( nextSleepFilename, function(error, nextSleep) {
        var startDate = new Date(Date.parse(nextSleep["sleep"][0]["startTime"]));
        var sleepMinuteData = nextSleep["sleep"][0]["minuteData"];

        var startTime = 1339
        if (startDate.getDate() == day) {
            startTimeString = sleepMinuteData[0]["dateTime"];
            startTime = (+(startTimeString.slice(0, 2)) * 60) + +(startTimeString.slice(3, 5));
        }
        
        var endTime = 1339; // better ideas?

        sleepData.push(startTime);
        sleepData.push(endTime);

        Visualize1Day(calFilename, sleepData);
    });    
}

function Visualize1Day( calFilename, sleepData)
{
    d3.json(calFilename, function(error, barData) {
        barData = barData["activities-calories-intraday"]["dataset"];
        for(var i in barData) {
            barData[i].METS = +barData[i].mets;
        }

        var sleepIntervals = computeSleep(barData);
        var barDataBouts = computeBouts(barData);
        
        var mlClr, myClrS ; // color of current mark's fill, stroke
        var maxRawY = d3.max(barData, function(d) { return d.METS; }) ;

        // yScaled.domain( [0, maxRawY*2 ] ) ;
        // console.log( "yScaled domain " + maxRawY*2 );

        //displayRawMets(barData);    
        //display10MinMets(barData);
        displayBouts(barDataBouts, sleepData);

        //// draw X axis
        chart.append("g")
            .attr("class", "axis")
            .attr( "transform", "translate(0," + drawHeight + ")" )
            .call( xAxis );

        //// draw Y axis
        chart.append("g")
            .attr("class", "axis")
            .attr( "transform", "translate( 49, 0)" )
            .call( yAxis );
    });
}


/*****************************
ALL THINGS COMPUTING BOUTS
*****************************/

// Defines a bout object
function boutObject(startTime, endTime, totalMets, breaks)
{
    this.startTime = startTime;
    this.endTime = endTime;
    this.totalMets = totalMets;
    this.breaks = [];
    for (var i = 0; i < breaks.length; i++) {
        this.breaks.push(breaks[i]);
    }
    this.duration = endTime - startTime;
    this.averageMets = totalMets / this.duration;
    if (this.averageMets > 10) {
        this.kind = "active";
        if (this.duration > minBoutMins) {
            if (this.averageMets >= minBoutMETS && this.averageMets < maxBoutMETS) {
                this.kind = "mvpa";    
            } else if (this.averageMets >= maxBoutMETS) {
                this.kind = "vigorous";
            }
        }
    } else {
        //console.log("breaks: " + this.breaks.length + " duration: " + this.duration);
        if (this.duration >= minSedentaryMins && this.breaks.length == 0) {
            this.kind = "sedentary";
        } else {
            this.kind = "inactive";    
        }
    }
}

// defines a break object
function breakObject(moment, kind, calMets)
{
    this.moment = moment;
    this.kind = kind;
    this.calMets = calMets;
}

function sedentaryObject(start, end)
{
    this.start = start;
    this.end = end;
    this.duration = this.end - this.start;
}

function computeBouts(barData)
{
    var boutData = [];  // array of bout objects
    var breakList = [];
    var trackingActive = (barData[0].METS > 10) ? true : false; // tracks whether bout object is active

    var countMets = 0; // mets being counted in a bout
    var startTime = 0;

    for (var i = 0; i < barData.length; i++)
    {
        var calMets = +barData[i].METS;
        var switchTo = toSwitch(trackingActive, calMets);

        // Record a break
        if (i < (barData.length - 1))
        {
            if (switchTo.localeCompare("go active") == 0)
            {
                if (+barData[i + 1].METS <= 10)
                {
                    var breakMake = new breakObject(i, "sitbreak", calMets);
                    breakList.push(breakMake);
                    continue;
                }
            }
            else if (switchTo.localeCompare("go inactive") == 0)
            {
                if (+barData[i + 1].METS > 10)
                {
                    var breakMake = new breakObject(i, "tolerated", calMets);
                    breakList.push(breakMake);               
                    continue;
                }
            }
        }

        // Record a bout
        if (switchTo.localeCompare("go active") == 0 || (trackingActive == false && i == barData.length - 1))
        {
            if (breakList.length == 0) {
                boutMake = new boutObject(startTime, i, countMets, breakList);
                //console.log("breakless: " + startTime + " " + i + " mets " + countMets);
                boutData.push(boutMake);
            } else {
                var timePoint = startTime;
                for (var j = 0; j < breakList.length; j++) {
                    
                    var breakSubList = [];
                    countMets = (breakList[j].moment - timePoint) * 10;
                    //console.log(timePoint, breakList[j].moment);
                    boutMake = new boutObject(timePoint, breakList[j].moment, countMets, breakSubList);
                    boutData.push(boutMake);
                    /*if (breakList[j].moment - timePoint >= minSedentaryMins) {
                        countMets = breakList[j].moment - timePoint;
                        boutMake = new boutObject(timePoint, breakList[j].moment, countMets, breakSubList);
                        boutData.push(boutMake);
                    } else {
                        boutMake = new boutObject(timePoint, breakList[j].moment, countMets, breakSubList);
                        boutData.push(boutMake); 
                    }*/
                    timePoint = breakList[j].moment;
                }
                countMets = (i - timePoint) * 10;
                boutMake = new boutObject(timePoint, i, countMets, breakSubList);
                boutData.push(boutMake);
            }

            startTime = i;
            countMets = 0;
            breakList.length = 0;
            trackingActive = true;
        }
        else if (switchTo.localeCompare("go inactive") == 0 || (trackingActive == true && i == barData.length - 1))
        {
            boutMake = new boutObject(startTime, i, countMets, breakList);
            boutData.push(boutMake);

            startTime = i;
            countMets = 0;
            breakList.length = 0;
            trackingActive = false;
        }

        countMets += calMets;
    }

    return boutData;
}

// Checks to see if it's time to record a different type of bout
function toSwitch(trackingActive, calMets)
{
    if (!trackingActive && calMets > 10)
    {
        return "go active";
    }
    else if (trackingActive && calMets <= 10)
    {
        return "go inactive";
    }
    return "continue";
}

////////// compute sleep intervals (morning and evening)
function computeSleep(barData)
{
    var sleepIntervals = [] ;
    var sleepIndex = -1, isSleeping = 0 ;
    var sleepOne = new Array ;  // a single interval of sleep
    for( var i = 0 ; i < barData.length ; i++ )
    {
        if( isSleeping == 0 )
        {
            if( (+ barData[i].Sleep ) > 0 )
            {
                isSleeping = 1 ;
                sleepOne.push( +i );
            }
        }
        else
        {
            if( (+ barData[i].Sleep ) <= 0 )
            {
                isSleeping = 0 ;
                sleepOne.push( +i );
                sleepIntervals.push( sleepOne );
                sleepOne = new Array ;
            }
        }
    }
    if( isSleeping == 1  )
    {
        sleepOne.push( 1439 );  // last minute of day
        sleepIntervals.push( sleepOne );
    }

    for( var i = 0 ; i < sleepIntervals.length ; i++ )
    {
        console.log( "sleep " + sleepIntervals[i][0] + " - " + sleepIntervals[i][1] );
    }

    return sleepIntervals;
}


/*****************************
DISPLAY VISUALIZAION
*****************************/

function DrawWash()
{
    //d3.select("g.chartBouts").selectAll( "g" ).remove();    // dump old stuff if any
    ////////// Draw Sedentary wash and label
    sedentaryLbl.attr( "transform", "translate(" + margin + "," + (drawHeight - yScaled(15)) + ")" );
    sedentaryLbl
        .append("path")
        .attr('d', function(d) {
            var str;
            str = "m 0 0";
            str += " l " + drawWidth + " 0";
            str += " z ";
            return (str);
        })
        .style("stroke", "grey")
        .style( "fill", "white" ) ;

    sedentaryLbl.append( "text" )
        .text( "Inactive" )
        .attr( "x",  5 ) 
        .attr( "y", yScaled( 5 ) + 4 )  // vert size - font size
        .attr( "font-family", "sans-serif")
        .attr( "font-size", "12px")
        .attr( "fill", "rgb( 128, 128, 128 )");

    ////////// Draw Light Activity wash and label
    lightLbl.attr( "transform", "translate(" + margin + "," + (drawHeight - yScaled(30)) + ")" );
    lightLbl
        .append("path")
        .attr('d', function(d) {
            var str;
            str = "m 0 0";
            str += " l " + drawWidth + " 0";
            str += " z ";
            return (str);
        })
        .style("stroke", "grey")
        .style( "fill", "white" ) ;

    lightLbl.append( "text" )
        .text( "Light Activity" )
        .attr( "x",   5 ) 
        .attr( "y", yScaled(( 25 - 10) /2.0) +12/2 )    // vert size - font size
        .attr( "font-family", "sans-serif")
        .attr( "font-size", "12px")
        .attr( "fill", "rgb( 128, 128, 128 )");


    ////////// Draw Medium Activity wash and label
    mediumLbl.attr( "transform", "translate(" + margin + "," + (drawHeight - yScaled(60)) + ")" );
    mediumLbl
        .append("path")
        .attr('d', function(d) {
            var str;
            str = "m 0 0";
            str += " l " + drawWidth + " 0";
            str += " z ";
            return (str);
        })
        .style("stroke", "grey")
        .style( "fill", "white" ) ;

    mediumLbl.append( "text" )
        .text( "Moderate Activity" )
        .attr( "x",  5 ) 
        .attr( "y", yScaled(( 60 - 30 ) /2.0) +12/2 )   // vert size - font size
        .attr( "font-family", "sans-serif")
        .attr( "font-size", "12px")
        .attr( "fill", "rgb( 128, 128, 128 )");

    ////////// Draw High Activity wash and label
    highLbl.attr( "transform", "translate(" + margin + ", 0 )" ) ;
    highLbl
        .append( "rect")
        .attr( "height", yScaled(maxMETS - 60) )
        .attr( "width",  drawWidth )
        .style( "fill", shadowOverlay ) ;
    highLbl.append( "text" )
        .text( "Vigorous Activity" )
        .attr( "x",  5 ) 
        .attr( "y", yScaled(( maxMETS - 60 ) /2.0) +12/2 )  // vert size - font size
        .attr( "font-family", "sans-serif")
        .attr( "font-size", "12px")
        .attr( "fill", "rgb( 128, 128, 128 )");
    highLbl.append( "text" )
        .text( dayToDraw.toDateString() )
        .attr( "class",  "DateLabel" ) 
        .attr( "x",  (width / 2) ) 
        .attr( "y", 20 )    
        .attr( "font-family", "sans-serif")
        .attr( "font-size", "14px")
        .attr( "fill", "rgb( 64, 64, 64 )");
}

////////// minute-by-minute METS  
function displayRawMets(barData)
{  
    myClr = doRGBA( metsRGBA) ;
    if( !drawchartMETS )
    {
        myClr = doRGBAlpha( metsRGBA, 0.0) ;
    }
    d3.select("g.chartMETS").selectAll( "g" ).remove(); // dump old stuff if any
    var bar = chartMETS.selectAll("g")
        .data(barData)
        .enter().append("g")
        .attr("transform", function(d, i) 
        { 
            return "translate(" + xScaledTr( i * barWidth ) + ", " + (height - 50  - yScaled(d.METS)) + ")"; 
        });

    bar.append( "rect")
        .attr( "height", function(dt) { return yScaled(dt.METS) ; } )
        .attr( "width",  barWidth/2.0 )
        .style( "fill", myClr ) ;
}

////////// Compute METS on a 10-minute nonoverlapping window average
function display10MinMets(barData)
{
    var barDataTen = [ ];
    for( var i = 0 ; i < barData.length ; i += 10 )
    {
    var sum = 0.0 ;
        for( var j = 0 ; j < 10 ; j++ )
        {
            sum = sum + (+barData[i+j].METS) ;
        }
        sum = sum /10.0 ;       // 10 items, with FitBit METS reported at 10 times actual
        barDataTen.push ( sum );
    }

    myClr = doRGBA( metsTenRGBA) ;
    if( !drawchartTenMinutes )
    {
        myClr = doRGBAlpha( metsTenRGBA, 0.0) ;
    }
    d3.select("g.chartTenMinutes").selectAll( "g" ).remove();   // dump old stuff if any
    var barT = chartTenMinutes.selectAll("g")
        .data(barDataTen)
      .enter().append("g")
        .attr("transform", function(d, i) 
            { return "translate(" + xScaledTr( i * barWidth * 10) + ", " + 
                (height - 50  - yScaled(d)) + ")"; });
    barT.append( "rect")
        .attr( "height", function(dt) { return yScaled(dt) ; } )
        .attr( "width",  xScaled( (10.0*barWidth) -1.0 ) )
        .style( "fill", myClr ) ;    
}

// draw each bout
function displayBouts(barDataBouts, sleepData)
{
    d3.select("g.chartBouts").selectAll( "g" ).remove();    // dump old stuff if any
    d3.select("svg.chart").selectAll( "g.axis" ).remove();    // dump old axis if any
    var myClr = doRGBA( boutsRGBA) ;
    var inactiveClr = doRGBA( inactivityRGBA) ;
    if( !drawchartBouts )
    {
        myClr = doRGBAlpha( boutsRGBA, 0.0) ;
        inactiveClr = doRGBAlpha(inactivityRGBA, 0.0);
    }

    var lastEndAct = 0;
    var lastEndIn = 0;
    var t = textures.lines()
        .size(5)
        .strokeWidth(1.5)
        .stroke("#00b653");
    chartBouts.call(t);

    var blackStripe = textures.lines()
        .size(5)
        .strokeWidth(1.5)
        .stroke("#003619");
    chartBouts.call(blackStripe);

    for( var i = 0 ; i < barDataBouts.length ; i++ )
    {   
        var drawSolid = true;
        var drawStriped = false;
        var about = barDataBouts[i];
        var boutWidth = about.duration;
        var boutHeight = about.averageMets;
        
        if (about.kind.localeCompare("mvpa") == 0 || about.kind.localeCompare("vigorous") == 0) {
            if ((lastEndAct + minBoutInterval) > about.startTime && i != 0)
            {
                drawSolid = false;
                drawStriped = true;
            }
            if (about.duration > maxBoutMins) 
            {
                boutWidth = maxBoutMins;
                drawStriped = true;
            }
            if (about.averageMets > maxBoutMETS && drawSolid)
            {
                boutY = about.averageMets - maxBoutMETS;
                boutHeight = maxBoutMETS;
                drawStriped = true;
            }
            
            if (drawStriped)
            {
                chartBouts.append( "g" ) // Draw too much activity rectangles
                    .attr("transform", "translate(" + xScaledTr(about.startTime) + ", " + (height - margin -yScaled(about.averageMets) ) + ")" )
                    .append( "rect" )
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", yScaled(about.averageMets))
                    .attr("width", xScaled(about.duration))
                    .style("fill", t.url());                
            }
            if (drawSolid)
            {
                chartBouts.append( "g" ) // Draw bout rectangles
                    .attr("transform", "translate(" + xScaledTr(about.startTime) + ", " + (height - margin -yScaled(boutHeight) ) + ")" )
                    .append( "rect" )
                    .attr("x", 0)
                    .attr("y", yScaled(0))
                    .attr("height", yScaled(boutHeight))
                    .attr("width", xScaled(boutWidth))
                    .on( "mouseover", function( bout, i ) {showtooltip( about,i )} ) 
                    .on( "mouseout",  hidetooltip )
                    .style( "fill", myClr ) ;               
            }

            chartBouts.append( "g" ) // Draw bout shadow triangles
                .attr("transform", "translate(" + xScaledTr(about.startTime) + ", " + (height - margin -yScaled(about.averageMets) ) + ")" )
                .append("path")
                .attr('d', function(d) {
                    var str;
                    str = "M " + xScaled(about.duration) + " 0 ";
                    str += " l 0 " + yScaled(about.averageMets);
                    str += " l " + xScaled(minBoutInterval) + " 0 ";
                    str += " z ";
                    return (str);
                })
                .style("fill", shadowOverlay);

                lastEndAct = about.endTime;

        } else if (about.kind.localeCompare("active") == 0) {
            /*chartBouts.append( "g" ) // Draw inactive bouts
                    .attr("transform", "translate(" + xScaledTr(about.startTime) + ", " + (height - margin -yScaled(about.averageMets) ) + ")" )
                    .append( "rect" )
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("height", yScaled(about.averageMets))
                    .attr("width", xScaled(about.duration))
                    .style( "fill", subMetsRGBA ) ;*/

        } else if (about.kind.localeCompare("inactive") == 0) {
            /*if (about.breaks.length > 0) {
                var start = about.startTime;
                
                for (var j = 0; j < about.breaks.length; j++) {
                    var duration = about.breaks[j].moment - start;
                    chartBouts.append( "g" ) // Draw inactive bouts
                        .attr("transform", "translate(" + xScaledTr(start) + ", " + (height - margin -yScaled(about.averageMets) ) + ")" )
                        .append( "rect" )
                        .attr("x", 0)
                        .attr("y", yScaled(about.averageMets - 10))
                        .attr("height", yScaled(10))
                        .attr("width", xScaled(duration))
                        .style( "fill", inactivityRGBA );
                    start = about.breaks[j].moment + 0;
                }
            } else {*/

            if ((about.startTime < sleepData[0] && about.endTime < sleepData[0]) ||
                ((about.startTime > sleepData[1] && about.endTime > sleepData[1]) && 
                (about.startTime < sleepData[2] && about.endTime < sleepData[2]))) {

                chartBouts.append( "g" ) // Draw inactive bouts
                    .attr("transform", "translate(" + xScaledTr(about.startTime) + ", " + (height - margin -yScaled(about.averageMets) ) + ")" )
                    .append( "rect" )
                    .attr("x", 0)
                    .attr("y", yScaled(about.averageMets - 10))
                    .attr("height", yScaled(10))
                    .attr("width", xScaled(about.duration))
                    .style( "fill", inactiveClr );
                } else {
                chartBouts.append( "g" ) // Draw sleep inactive bouts
                    .attr("transform", "translate(" + xScaledTr( about.startTime ) + ", " + (height - margin -yScaled(about.averageMets - 5)) + ")" )
                    .append( "rect" )
                    .attr("x", 0)
                    .attr("y", yScaled(about.averageMets - 10))
                    .attr("height", yScaled(5))
                    .attr("width", xScaled(about.duration))
                    .style( "fill", inactiveClr) ;
                }
           // }
            
        } else if (about.kind.localeCompare("sedentary") == 0) {
            if ((about.startTime < sleepData[0] && about.endTime < sleepData[0]) ||
                ((about.startTime > sleepData[1] && about.endTime > sleepData[1]) && (about.startTime < sleepData[2] && about.endTime < sleepData[2]))) {
                chartBouts.append( "g" ) // Draw sedentary bouts
                    .attr("transform", "translate(" + xScaledTr( about.startTime ) + ", " + (height - margin -yScaled(about.averageMets) ) + ")" )
                    .append( "rect" )
                    .attr("x", 0)
                    .attr("y", yScaled(about.averageMets - 10))
                    .attr("height", yScaled(10))
                    .attr("width", xScaled(about.duration))
                    .style( "fill", blackStripe.url() ) ;
            } else {
                chartBouts.append( "g" ) // Draw sleep inactive bouts
                    .attr("transform", "translate(" + xScaledTr( about.startTime ) + ", " + (height - margin -yScaled(about.averageMets - 5)) + ")" )
                    .append( "rect" )
                    .attr("x", 0)
                    .attr("y", yScaled(about.averageMets - 10))
                    .attr("height", yScaled(5))
                    .attr("width", xScaled(about.duration))
                    .style( "fill", inactiveClr) ;
            }
        }
    }
}

function showtooltip(bout,i)
{
    console.log(bout.startTime);
var METS     = Math.round(bout.averageMets) /10  ;
var str = "&nbsp; Bout " + bout.duration + 
        " Minutes at " + METS +
        " METS <br>" ;

    if( bout.averageMets > maxBoutMETS )
        str += "&nbsp; Bout is a bit more vigorous than the recommended maximum of " + (maxBoutMETS /10) + " METS <br>"

    if( bout.duration > maxBoutMins )
        str += "&nbsp; Bout is longer than the recommended maximum of " + maxBoutMins + " Minutes <br>"

    d3.select("#tooltip")
    .html( str)
    .style({
        "display": "block",
        "left": d3.event.pageX + "px",
        "top": d3.event.pageY + "px"
    });
    console.log( "toolitip  " + bout.averageMets );
}

function hidetooltip()
{
    console.log( "hide toolitip  "  );
    d3.select("#tooltip")
    .style("display", "none")
}

function PrevNext()
{
    if( this.id == "ref-NextDay" )
    {
        dayToDraw.setDate( dayToDraw.getDate() +1 );
        nextDay.setDate(nextDay.getDate() + 1);
        console.log('Next!');
        goVisualize(dayToDraw, nextDay);
        highLbl.select( "text.DateLabel" )
            .text( dayToDraw.toDateString() );
    }
    if( this.id == "ref-PrevDay" )
    {
        dayToDraw.setDate( dayToDraw.getDate() -1 );
        nextDay.setDate(nextDay.getDate() - 1);
        console.log('Prev!');
        goVisualize(dayToDraw, nextDay);
        highLbl.select( "text.DateLabel" )
            .text( dayToDraw.toDateString() );
    }
}

function changeClr()
{
    if( this.id == "ref-ShowMinutes" )
    {
    if( this.checked == true )
    {
        drawchartMETS = true;
        chartMETS
        .selectAll( "rect" )
        .style( "fill", doRGBA( metsRGBA ) );
        console.log( "Show Minutes" );
    }
    else
    {
        drawchartMETS = false ;
        chartMETS
        .selectAll( "rect" )
        .style( "fill", doRGBAlpha( metsRGBA, 0.0 ) );
        console.log( "Hide Minutes" );
    }
    }

    if( this.id == "ref-Show10Mins" )
    {
    if( this.checked == true )
    {
        drawchartTenMinutes = true ;
        chartTenMinutes
        .selectAll( "rect" )
        .style( "fill", doRGBA( metsTenRGBA ) );
        console.log( "Show 10 Minutes" );
    }
    else
    {
        drawchartTenMinutes = false ;
        chartTenMinutes
        .selectAll( "rect" )
        .style( "fill", doRGBAlpha( metsTenRGBA, 0.0 ) );
        console.log( "Hide 10 Minutes" );
    }
    }

    if( this.id == "ref-Bouts" )
    {
    if( this.checked == true )
    {
        drawchartBouts = true ;
        chartBouts
        .selectAll( "path" )
        .style( "fill", doRGBA( boutsRGBA) ) ;
        console.log( "Show Bouts" );
    }
    else
    {
        drawchartBouts = false ;
        chartBouts
        .selectAll( "path" )
        .style( "fill", doRGBAlpha( boutsRGBA, 0.0) ) ;
        console.log( "Hide Bouts" );
    }
    }
    if( this.id == "ref-TooActive" )
    {
    if( this.checked == true )
    {
        drawchartBoutsTAct = true ;
        chartBoutsTAct
        .selectAll( "path" )
        .style( "fill", "none" ) 
        .style( "stroke", doRGBA( boutsTActRGBA) ) ;
        console.log( "Show Too Active" );
    }
    else
    {
        drawchartBoutsTAct = false ;
        chartBoutsTAct
        .selectAll( "path" )
        .style( "fill", "none" ) 
        .style( "stroke", doRGBAlpha( boutsTActRGBA, 0.0) ) ;
        console.log( "Hide Too Active" );
    }
    }

    if( this.id == "ref-TooLong" )
    {
    if( this.checked == true )
    {
        drawchartBoutsTLong = true ;
        chartBoutsTLong
        .selectAll( "path" )
        .style( "fill", doRGBA( boutsTLongRGBA) ) 
        .style( "stroke", doRGBAlpha( boutsTLongRGBA, 0.6) ) ;
        console.log( "Show Too Long" );
    }
    else
    {
        drawchartBoutsTLong = false ;
        chartBoutsTLong
        .selectAll( "path" )
        .style( "fill", doRGBAlpha( boutsTLongRGBA, 0.0) ) 
        .style( "stroke", doRGBAlpha( boutsTLongRGBA, 0.0) ) ;
        console.log( "Hide Too Long" );
    }
    }

    if( this.id == "ref-TooSoon" )
    {
    if( this.checked == true )
    {
        drawchartBoutsTSoon = true ;
        chartBoutsTSoon
        .selectAll( "path" )
//      .style( "fill", doRGBA( boutsTSoonRGBA) ) 
        .style( "stroke", doRGBA( boutsTSoonRGBA) ) ;
        console.log( "Show Too Soon" );
    }
    else
    {
        drawchartBoutsTSoon = false ;
        chartBoutsTSoon
        .selectAll( "path" )
//      .style( "fill", doRGBAlpha( boutsTSoonRGBA, 0.0) ) 
        .style( "stroke", doRGBAlpha( boutsTSoonRGBA, 0.0) ) ;

        console.log( "Hide Too Soon" );
    }
    }

}


function doRGBA( theRGBA )
{
    return( "rgba( " + theRGBA[0] + ","
        + theRGBA[1] + ","
        + theRGBA[2] + ","
        + theRGBA[3] + ")" );
}

function doRGBAlpha( theRGBA, alpha )
{
    return( "rgba( " + theRGBA[0] + ","
        + theRGBA[1] + ","
        + theRGBA[2] + ","
        + alpha + ")" );
}

//function copied from http://papermashup.com/read-url-get-variables-withjavascript/
function getGetParameters(){
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


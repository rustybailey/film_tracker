$(document).ready(function() {

    var url = 'http://api.themoviedb.org/3/',
        list_mode = 'list/' + '5104152e19c295213109338a',
        question_key ='?api_key=f22e6ce68f5e5002e71c20bcba477e7d',
        base_url = "http://cf2.imgobject.com/t/p/",
        poster_sizes = [
            "w92",
            "w154",
            "w185",
            "w342",
            "w500",
            "original"
        ];

    var movieTemplate = _.template('<div id="<%= movieId %>" data-year="<%= year %>" class="movie">' +
        '<img src="<%= imgLink %>">' +
        '<div class="title-card"><%= movieName %> (<%= year %>)</div>' +
        '</div>'
        );

    var count = 0;
    var timer = setInterval(function(){count++}, 1000);

    $.ajax({
        type: 'GET',
        url: url + list_mode + question_key,
        dataType: 'jsonp',
        success: function(data) {
            var movieIds = [];
            $.each(data.items, function(index, movie){
                if(!movie) return // Fix for movies that return null
                var release = movie.release_date;
                var year = new Date(release).getFullYear();
                var title = movie.title;
                var id = movie.id;
                var imgLink = base_url + poster_sizes[0] + movie.poster_path;
                $(movieTemplate({
                    movieId: id,
                    movieName: title,
                    year: year,
                    imgLink: imgLink
                })).appendTo('#movies-container');
                movieIds.push(id);
            });
            $.each(movieIds, function(i, v) {
                $.ajax({
                    type: 'GET',
                    url: url + 'movie/' + v + question_key,
                    dataType: 'jsonp',
                    success: function(movie) {
                        $('#' + v).data(movie);
                        if(movieIds.length - 1 === i) {
                            console.log("Finished in " + count + " seconds.");
                            clearTimeout(timer);
                            var runtime = totalMinutesWatched();
                            var minutesAwakeToDate = (d3.time.dayOfYear(new Date()) + 1) * 16 * 60;
                            var minutesSleepingToDate = (d3.time.dayOfYear(new Date()) + 1) * 8 * 60;

                            var data = [
                                ["Sleeping", minutesSleepingToDate],
                                ["Watching Movies", runtime],
                                ["Rest of Day", minutesAwakeToDate - runtime]
                            ];

                            var tooltip = d3.select("body")
                                .append("div")
                                .attr('class', 'pie-tooltip')
                                .style("position", "absolute")
                                .style("z-index", "10")
                                .style("visibility", "hidden")
                                .text("a simple tooltip");

                            var width = 200,
                                height = 200,
                                radius = Math.min(width, height) / 2;

                            var color = d3.scale.ordinal()
                                .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

                            var arc = d3.svg.arc()
                                .outerRadius(radius - 10)
                                .innerRadius(0);

                            var pie = d3.layout.pie()
                                .sort(null)
                                .value(function(d) { return d[1]; });

                            var svg = d3.select(".runtime-pie").append("svg")
                                .attr("width", width)
                                .attr("height", height)
                              .append("g")
                                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

                            var g = svg.selectAll(".arc")
                              .data(pie(data))
                            .enter().append("g")
                              .attr("class", "arc");

                            g.append("path")
                                .attr("d", arc)
                                .style("fill", function(d) { return color(d.data[0]); })
                                .on("mouseover", function(d){
                                    var percent = (d.endAngle - d.startAngle) / (2 * Math.PI);
                                    percent = d3.format('%')(percent); 
                                    return tooltip.style("visibility", "visible").text(d.data[0] + " (" + percent + ")");
                                })
                                .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
                                .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
                        }
                    }
                });
            });
        }
    });

    var totalMinutesWatched = function() {
        totalRuntime = 0;
        $('.movie').each(function() {
            totalRuntime += $(this).data("runtime");
        });
        return totalRuntime;
    }

    $('body').on('click', '.toggle-posters', function() {
        if($(this).text() === "Hide Posters") {
            $(this).text("Show Posters");
        } else {
            $(this).text("Hide Posters");
        }
        $('#movies-container').slideToggle();
    });



});



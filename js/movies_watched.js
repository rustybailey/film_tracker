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

    var movieTemplate = _.template('<div id="<%= movieName %>" data-year="<%= year %>" class="movie">' +
        '<img src="<%= imgLink %>">' +
        '<div class="title-card"><%= movieName %> (<%= year %>)</div>' +
        '</div>'
        );

    $.ajax({
        type: 'GET',
        url: url + list_mode + question_key,
        async: false,
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(json) {
            $.each(json.items, function(index, movie){
                if(!movie) return // Fix for movies that return null
                var release = movie.release_date;
                var year = new Date(release).getFullYear();
                var title = movie.title;
                var imgLink = base_url + poster_sizes[0] + movie.poster_path;
                $(movieTemplate({
                    movieName: title,
                    year: year,
                    imgLink: imgLink
                })).appendTo('#movies-container');
            })
        }
    });


});



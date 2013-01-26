$(document).ready(function($) {

var url = 'http://api.themoviedb.org/3/',
    list_mode = 'list/' + '5104152e19c295213109338a',
    search_mode = 'search/movie',
    query = '?query='
    and_key = '&api_key=f22e6ce68f5e5002e71c20bcba477e7d',
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
//      movies_watched = [
//          "Video Game High School",
        // "Beverly Hills Cop",
        // "Justice League: Doom",
        // "Punch-Drunk Love",
        // "7 Up",
        // "7 Plus Seven",
        // "Snow on Tha Bluff",
        // "21 Up",
        // "Primer",
        // "Machine Gun Preacher",
        // "Jeff, Who Lives at Home"
//      ];
var movieTemplate = _.template('<div id="<%= movieName %>" class="movie">' +
    '<p> <%= movieName %> - <%= year %> </p>' +
    '<img src="<%= imgLink %>">' +
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
            var release = movie.release_date;
            var year = release.substring(0, 4);
            var title = movie.title;
            var imgLink = base_url + poster_sizes[1] + movie.poster_path;
            $(movieTemplate({
                movieName: title,
                year: year,
                imgLink: imgLink
            })).appendTo('#movies-container');
        })
    }
});

$('#movie-search').keyup(function(e) {
    console.log($(this).val())
    movieName = encodeURI($(this).val());
    $.ajax({
        type: 'GET',
        url: url + search_mode + query + movieName + and_key,
        async: false,
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(json) {
            titles = [];
            $.each(json.results, function(index, movie){
                var release = movie.release_date;
                //var year = release.substring(0, 4);
                var title = movie.title;
                var imgLink = base_url + poster_sizes[1] + movie.poster_path;
                titles.push(title);
                // $(movieTemplate({
                //     movieName: title,
                //     year: year,
                //     imgLink: imgLink
                // })).appendTo('#movies-container');
            })
            console.log(titles);
            $('#movie-search').trigger('setSuggestions', { result : titles });

        }
    });
})

$('#movie-search').textext({ plugins : 'autocomplete suggestions' }).click(function(e) {
            $(this).trigger('toggleDropdown');
        }
    );


});



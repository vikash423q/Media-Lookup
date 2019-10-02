// fetching movies from the TMDB api
var getMovies = () => {
    return function(val, cb, scb){
    var formatted_val = val.split(' ').join('%20');
    const api_key = '01cf8197ec0f33f3ac811d93e77b1a94';
    const api_url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${formatted_val}`;
    $.get(api_url, function (data, status) {
        const movies = [];
        if (data.total_results != 0) {
            data.results.forEach(res => movies.push(res));
        }
        scb(movies);
    });
  }
}

// function to return custom typeahead template
var highlighter = () => {
  return function(item){
  return '<div class="card-body media-card py-1">'
    +'<p class="media-title mb-0">'+item.title
    +'</p><p class="media-release d-inline small mb-0">Release : '+item.release_date
    +'</p><p class="media-rating d-inline float-right small mb-0">Rating : '+item.vote_average
    +'</p></div>'
}
}

// typeahead configuration
$('#movie-text.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
}, {
    name: 'movies',
    source: getMovies(),
    templates:{
      suggestion:highlighter()
    }
});

// handling typeahead select, autocomplete, cursorchange events to set card.
$('#movie-text.typeahead').on({
    'typeahead:select':function(e){
      var movie = JSON.parse(e.target.value);
      setCard(movie,'movie');
    },
    'typeahead:autocomplete':function(e){
      var movie = JSON.parse(e.target.value);
      setCard(movie,'movie');
    },
    'typeahead:cursorchange':function(e){
      var movie = JSON.parse(e.target.value);
      setCard(movie,'movie');
    }
});

// animating on card hover event
$('#movie-card').hover(
  function(){
    $('.overview-movie-container').animate({height:"+=10px"},250);
    $('.showcase-movie-header').animate({paddingTop:"+=10px"},250);
  },
  function(){
    $('.overview-movie-container').animate({height:"-=10px"},250);
    $('.showcase-movie-header').animate({paddingTop:"-=10px"},250);

  }
);

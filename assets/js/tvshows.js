var getTVShows = () => {
    return function(val, cb, scb){
    var formatted_val = val.split(' ').join('%20');
    const api_key = '01cf8197ec0f33f3ac811d93e77b1a94';
    const api_url = `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&query=${formatted_val}`;
    $.get(api_url, function (data, status) {
        const shows = [];
        if (data.total_results != 0) {
            data.results.forEach(res => shows.push(res));
        }
        scb(shows);
    });
  }
}

var highlighter = () => {
  return function(item){
  return '<div class="card-body media-card py-1">'
    +'<p class="media-title mb-0">'+item.name
    +'</p><p class="media-release d-inline small mb-0">First Air : '+item.first_air_date
    +'</p><p class="media-rating d-inline float-right small mb-0">Rating : '+item.vote_average
    +'</p></div>'
}
}

// typeahead
$('#tvshow-text.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
}, {
    name: 'tvshows',
    source: getTVShows(),
    templates:{
      suggestion:highlighter()
    }
});

$('#tvshow-text.typeahead').on({
    'typeahead:select':function(e){
      var show = JSON.parse(e.target.value);
      setCard(show,'tvshow');
    },
    'typeahead:autocomplete':function(e){
      var show = JSON.parse(e.target.value);
      setCard(show,'tvshow');
    },
    'typeahead:cursorchange':function(e){
      var show = JSON.parse(e.target.value);
      setCard(show,'tvshow');
    }
});

// animating on card hover event
$('#tvshow-card').hover(
  function(){
    $('.overview-tvshow-container').animate({height:"+=10px"},250);
    $('.showcase-tvshow-header').animate({paddingTop:"+=10px"},250);
  },
  function(){
    $('.overview-tvshow-container').animate({height:"-=10px"},250);
    $('.showcase-tvshow-header').animate({paddingTop:"-=10px"},250);
  }
);

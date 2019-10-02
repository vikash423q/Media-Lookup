
// downloading and storing genres id for further conversions to string.
var genres = []
var genres_url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=01cf8197ec0f33f3ac811d93e77b1a94'
$.get(genres_url, function (data, status) {
  genres = data.genres;
});


$(document).ready(function () {
  var typed = new Typed('.heading', {
    strings: ["<h1>Looking For Something Entertaining?</h1>^500"],
    typeSpeed: 40,
    contentType: 'html',
    showCursor: false,
    onComplete: function () {
      var typed2 = new Typed('.subheading', {
        strings: ["<h2>You Are At The Right Place.</h2>^300", "<h2>Let's Begin!</h2>"],
        typeSpeed: 40,
        contentType: 'html'
      });
    }
  });

});

// formatting date in 12 May, 2012 format
var formatted_date = function (date) {
  var time = new Date(date);
  time = dateFormat(time, "dS mmmm, yyyy");
  return time
}
// formatting genre strings for genre ids
var formatted_genre = function (args) {
  if (genres.length === 0) {
    $.get(genres_url, function (data, status) {
      genres = data.genres;
      return get_str(args);
    });
  } else {
    return get_str(args);
  }
}

// matching genre strings with genre ids
var get_str = function (args) {
  str = ''
  for (i = 0; i < genres.length; i++) {
    for (j = 0; j < args.length; j++) {
      if (genres[i].id === args[j]) {
        str += ' ' + genres[i].name;
        console.log(str);
      }
    }
  }
  return str;
}

// setting card after populating movie details
var setCard = (data, type) => {
  var container = { ...data };
  var image_url = `https://image.tmdb.org/t/p/w400${container.poster_path}`;
  var more_url = '#';
  $(window).resize(function () {
    var height = 0;
    $(`.${type}-detail`).each(function () {
      height += $(this).outerHeight();
      console.log(height);
    });
    var ht = height + $('.more-btn').outerHeight();
    $(`.overview-${type}-container`).height(ht + 12);
  });

  if (type === 'book') {
    container = data.volumeInfo;
    $(`input#${type}-text`).typeahead('val', container.title);
    str = '';
    for (i = 0; i < container.categories.length; i++) { str += ' ' + container.categories[i] }
    container.categories = str;
    str = '';
    for (i = 0; i < container.authors.length; i++) { str += ' ' + container.authors[i] }
    container.authors = str;
    data.searchInfo = data.searchInfo || {};
    container.description = container.description || data.searchInfo.textSnippet || container.subtitle;
    container.subtitle = container.subtitle || '';
    container.averageRating = container.averageRating || 'NA';
    if (container.description.length > 350) { container.description = container.description.slice(0, 351) + '...' }
    image_url = container.imageLinks.thumbnail;
    image_url = image_url.replace('zoom=1', 'zoom=2');
    image_url = image_url.replace('&edge=curl', '');
    // book more_url to integrate here
    more_url = `https://play.google.com/store/books/details?id=${data.id}&source=gbs_api`;
    var bookCard = `<div class=\"showcase-${type} card card-body bg-dark m-auto\"><div class=\"${type}-img-container\"><div class=\"card-header showcase-${type}-header d-flex flex-row align-items-center justify-content-between\"><div><h5 class=\"mb-0 ${type}-title\">${container.title}</h5><p class=\"mb-0 book-subtitle small\">${container.subtitle}</p></div><div class=\"d-flex flex-row align-items-center justify-content-around\"><p class=\"mb-0\"><i class=\"fas fa-star text-warning mr-1\" ></i></p><p class=\"mb-0\">${container.averageRating}</p></div></div></div><div class=\"overview-${type}-container text-center p-2\"><p class=\"mb-0 ${type}-detail\">Author : ${container.authors}</p><p class=\"mb-0 ${type}-detail\">Published : ${formatted_date(container.publishedDate)}</p><p class=\"mb-2 ${type}-detail\">Categories : ${container.categories}</p><div class=\"line ${type}-detail\"></div><div class=\"overview-${type}-text ${type}-detail mb-0 mt-2 py-2\"><p class="mb-0">${container.description}</p></div><a class=\"btn btn-outline-light more-btn btn-sm btn-block\" href=\"${more_url}\">Read More<i class=\"fas fa-arrow-right ml-1\"></i></a></div></div>`
    $(`#${type}-card`).html(bookCard);
    $(`.${type}-img-container`).css('background-image', 'url("' + image_url + '")');
    $(`.overview-${type}-container`).height($(`.overview-${type}-container`).height() + $('.more-btn').height() + 12 + 'px');
    $('body,html').animate({ scrollTop: $(`.search-${type}`).offset().top }, 400);
    return;
  } else if (type === 'tvshow') {
    container.title = container.name;
    container.release_date = container.first_air_date;
    more_url = `https://www.themoviedb.org/tv/${container.id}`;
  } else if (type === 'movie') {
    more_url = `https://www.themoviedb.org/${type}/${container.id}`;
  }
  if (container.overview.length > 350) { container.overview = container.overview.slice(0, 351) + '...' }
  var card = `<div class=\"showcase-${type} card card-body bg-dark m-auto\"><div class=\"${type}-img-container\"><div class=\"card-header showcase-${type}-header d-flex flex-row align-items-center justify-content-between\"><h5 class=\"mb-0 ${type}-title\">${container.title}</h5><div class=\"d-flex flex-row align-items-center justify-content-around\"><p class=\"mb-0\"><i class=\"fas fa-star text-warning mr-1\" ></i></p><p class=\"mb-0\">${container.vote_average}</p></div></div></div><div class=\"overview-${type}-container text-center p-2\"><div class=\"media-${type}-feature\"><p class=\"mb-0 ${type}-detail\">Release : ${formatted_date(container.release_date)}</p><p class=\"mb-2 ${type}-detail\">Genre : ${formatted_genre(container.genre_ids)}</p></div><div class=\"line ${type}-detail\"></div><div class=\"overview-${type}-text ${type}-detail mb-0 mt-2 py-2\"><p class="mb-0">${container.overview}</p></div><a class=\"btn btn-outline-light more-btn btn-sm btn-block\" href=\"${more_url}\">Read More<i class=\"fas fa-arrow-right ml-1\"></i></a></div></div>`
  $(`input#${type}-text`).typeahead('val', container.title);
  $(`#${type}-card`).html(card);
  $(`.${type}-img-container`).css('background-image', 'url("' + image_url + '")');
  $(`.overview-${type}-container`).height($(`.overview-${type}-container`).height() + $('.more-btn').height() + 12 + 'px');
  $('body,html').animate({ scrollTop: $(`.search-${type}`).offset().top }, 400);
}

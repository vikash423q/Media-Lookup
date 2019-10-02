var getBooks = () => {
    return function(val, cb, scb){
    var formatted_val = val.split(' ').join('+');
    const api_key = '';
    const api_url = `https://www.googleapis.com/books/v1/volumes?q=${formatted_val}&key=${api_key}`;
    $.get(api_url, function (data, status) {
        const books = [];
        if (data.totalItems != 0) {
            data.items.forEach(res => books.push(res));
        }
        scb(books);
    });
  }
}

var highlighter = () => {
  return function(item){
    item.volumeInfo.authors = item.volumeInfo.authors || '';
  return '<div class="card-body media-card py-1">'
    +'<p class="media-title mb-0">'+item.volumeInfo.title
    +'</p><p class="media-release d-inline small mb-0">Author : '+item.volumeInfo.authors[0]
    +'</p><p class="media-rating d-inline float-right small mb-0">Published : '+item.volumeInfo.publishedDate
    +'</p></div>'
}}

// typeahead
$('#book-text.typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
}, {
    name: 'book',
    source: getBooks(),
    templates:{
      suggestion:highlighter()
    }
});

$('#book-text.typeahead').on({
    'typeahead:select':function(e){
      var book = JSON.parse(e.target.value);
      setCard(book,'book');
    },
    'typeahead:autocomplete':function(e){
      var book = JSON.parse(e.target.value);
      setCard(book,'book');
    },
    'typeahead:cursorchange':function(e){
      var book = JSON.parse(e.target.value);
      setCard(book,'book');
    }
});

// animating on card hover event
$('#book-card').hover(
  function(){
    $('.overview-book-container').animate({height:"+=10px"},250);
    $('.showcase-book-header').animate({paddingTop:"+=10px"},250);
  },
  function(){
    $('.overview-book-container').animate({height:"-=10px"},250);
    $('.showcase-book-header').animate({paddingTop:"-=10px"},250);
  }
);

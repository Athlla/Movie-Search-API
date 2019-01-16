var api_key = 'YOUR-API-KEY';   // API TMDB
var api_key2 = 'YOUR-API-KEY';         // API http://docs.farzain.com

// Cinema
function getCinemas() {
    var body = document.getElementById('body');
    body.innerHTML = "";
    var kota = sessionStorage.getItem('kota');

    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://cors-anywhere.herokuapp.com/https://rest.farzain.com/api/special/bioskop/bioskop.php?id=' + kota + '&apikey=' + api_key2);
    
    ourRequest.onload = function () {
        var ourData = JSON.parse(ourRequest.responseText); //pasing ke objek js
        console.log(ourData);
        var htmlString = `<div class="row">`;
        for (var i = 0; i < ourData.length; i++) {
            ourData[i].url += " ";
            var ekstensi = ourData[i].url.slice(-5, -1);
            if (ekstensi == "html"){
                var namaBioskop = ourData[i].title.slice(0, -3)
                namaBioskop = namaBioskop.replace('hari', '');
                
                htmlString += `
                    <div class="container">
                        <div class="product">
                            <a href="#" onclick="getURL('${ourData[i].url}', '${namaBioskop}')" style="color: grey">
                                <div class="product_content">
                                    <div class="product_info flex-row align-items-start justify-content-start">
                                        <h3>${namaBioskop}</h3>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                `;
            }
        }    
        body.insertAdjacentHTML("beforeend", htmlString);
    };
    ourRequest.send();
}

function getURL(id, bioskop) {
    sessionStorage.setItem('urlBioskop', id);
    sessionStorage.setItem('namaBioskop', bioskop);
    window.location = "nowShowing.html";
    return false;
}

function getNowShowing() {
    var test = document.getElementById('body');
    var urlBioskop = sessionStorage.getItem('urlBioskop');
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://cors-anywhere.herokuapp.com/https://rest.farzain.com/api/special/bioskop/bioskop_result.php?apikey=' + api_key2 + '&id=' + urlBioskop);
    ourRequest.onload = function () {
        var ourData = JSON.parse(ourRequest.responseText);
        console.log(ourData);
        var htmlString = "";
        for (var i = 0; i < ourData.length; i++) {
            var actors = ourData[i].Actors.replace('Actors : ', '');
            htmlString += `
                <div class="row border mb-5">
                    <div class="col-sm">
                        <h3 class="mt-4">${ourData[i].title}</h3>
                        <table class="table">
                            <tr>
                                <td>Cast</td>
                                <td>${actors}</td>
                            </tr>
                            <tr>
                                <td>Genre - Durasi</td>
                                <td>${ourData[i].category}</td>
                            </tr>
                            <tr>
                                <td>Jadwal</td>
                                <td>${ourData[i].Jadwal}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-sm-md boder-ra">
                        <img src=${ourData[i].img} class="rounded" width="150px"></img>
                    </div>
                </div>
            `;
        }

        test.insertAdjacentHTML("beforeend", htmlString);
    };
    ourRequest.send();
}

// Popular Movies

function getPopular() {
    var body = document.getElementById('body');
    body.innerHTML = "";
    // console.log(keyword);

    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://api.themoviedb.org/3/movie/popular?api_key=' + api_key);
    ourRequest.onload = function () {
        var ourData = JSON.parse(ourRequest.responseText); //pasing ke objek js
        console.log(ourData);
        var htmlString = `<div class="row">`;
        if (ourData.total_results > 0) {
            for (var i = 0; i < ourData.results.length; i++) {
                var year = ourData.results[i].release_date.split('-').slice(0, 1);
                if (year != "") { year = '(' + year + ')'; }
                else { year = ""; }
                var poster = ourData.results[i].poster_path;
                if (poster != null) {
                    poster = 'https://image.tmdb.org/t/p/w500/' + ourData.results[i].poster_path;
                } else {
                    poster = "error_poster.jpg";
                }
                htmlString += `<div class="col-xl-4 col-md-6">
                        <div class="product">
                            <a href="#" onclick="getID('${ourData.results[i].id}')">
                                <div class="product_image" id="poster"><img src=${poster}></img></div>
                                <div class="product_content" id="title">
                                    <div class="product_info flex-row align-items-start justify-content-start">
                                        <div>
                                            <div class="text-center">
                                                <h3>${ourData.results[i].title} ${year}</h3>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                `;
                
            }
        } else {
            htmlString = `
            <div class="alert alert-danger" role="alert">
                Film tidak ditemukan!
            </div>`;
        }
        body.insertAdjacentHTML("beforeend", htmlString);
    };
    ourRequest.send();
}

// Search Result & Detail

function test() {
    var keyword = document.getElementById('keyword').value;
    sessionStorage.setItem('keyword', keyword);
    window.location = "search.html";
    // return false;
}

function results() {
    var body = document.getElementById('body');
    var keyword = sessionStorage.getItem('keyword');
    body.innerHTML = "";
    // console.log(keyword);
    
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://api.themoviedb.org/3/search/movie?api_key=' + api_key + '&query=' + keyword);
    ourRequest.onload = function () {
        var ourData = JSON.parse(ourRequest.responseText); //pasing ke objek js
        console.log(ourData);
        var htmlString = `Hasil pencarian untuk <b><i>${keyword}</i></b> <br><br> 
        <div class="row">`;
        if (ourData.total_results > 0) {
            for (var i = 0; i < ourData.results.length; i++) {
                var year = ourData.results[i].release_date.split('-').slice(0, 1);
                if (year != "") { year = '(' + year + ')'; }
                else { year = ""; }
                var poster = ourData.results[i].poster_path; 
                if (poster != null) {
                    poster = 'https://image.tmdb.org/t/p/w500/' + ourData.results[i].poster_path;
                } else {
                    poster = "error_poster.jpg";
                }
                htmlString += `<div class="col-xl-4 col-md-6">
                        <div class="product">
                            <a href="#" onclick="getID('${ourData.results[i].id}')">
                                <div class="product_image border" id="poster"> <img src=${poster}></img></div>
                                <div class="product_content" id="title">
                                    <div class="product_info flex-row align-items-start justify-content-start">
                                        <div>
                                            <div class="text-center">
                                                <h3>${ourData.results[i].title} ${year}</h3>  
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                `;
            }
        } else {
            htmlString = `
            <div class="alert alert-danger" role="alert">
                Film tidak ditemukan!
            </div>`;
        }
        htmlString += `</div>`
        body.insertAdjacentHTML("beforeend", htmlString);
    };
    ourRequest.send();

}

function getID(id) {
    sessionStorage.setItem('movieID', id);
    window.location = "detail.html";
    return false;
}

function movieDetail() {
    var test = document.getElementById('body');
    var id = sessionStorage.getItem('movieID');
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + api_key + '&append_to_response=credits');
    ourRequest.onload = function () {
        var ourData = JSON.parse(ourRequest.responseText);
        console.log(ourData);
        var htmlString = "";
        var poster = ourData.poster_path;
        if (poster != null) {
            poster = 'https://image.tmdb.org/t/p/w500/' + ourData.poster_path;
        } else {
            poster = "error_poster.jpg";
        }

        for (i = 0; i < ourData.genres.length; i++) {
            var genres;
            genres += ", " + ourData.genres[i].name;
        } 
        genres += " ";
        genres = genres.slice(11, -1);

        for(i = 0; i < 4; i++){
            var cast;
            cast += ", " + ourData.credits.cast[i].name;
        }
        cast += " ";
        cast = cast.slice(11, -1);

        for(i = 0; i < ourData.credits.crew.length; i++){
            var director;
            if (ourData.credits.crew[i].job == "Director"){
                director += ", " + ourData.credits.crew[i].name;
            }
        }
        director += " ";
        director = director.slice(11, -1);

        var year = ourData.release_date;
        if (year != "") { year; }
        else { year = ""; }
        htmlString += `
        <div class="row">
            <div class="col-sm">
                <h3>${ourData.title}</h3>
                <table class="table mt-5">
                    <tr>
                        <td>Director</td>
                        <td>${director}</td>
                    </tr>
                    <tr>
                        <td>Actors</td>
                        <td>${cast}</td>
                    </tr>
                    <tr>
                        <td>Genre</td>
                        <td>${genres}</td>
                    </tr>
                    <tr>
                        <td>Runtime</td>
                        <td>${ourData.runtime} minutes</td>
                    </tr>
                    <tr>
                        <td>Release</td>
                        <td>${year}</td>
                    </tr>
                    <tr>
                        <td>Synopsis</td>
                        <td align="justify">${ourData.overview}</td>
                    </tr>
                </table>
            </div>
            <div class="col-sm-md boder-ra">
                <img src=${poster} class="rounded" width="300px"></img>
            </div>
        </div>
        <div class="mt-3">
            <a href="https://www.imdb.com/title/${ourData.imdb_id}" target="_blank" class="btn btn-secondary">Lihat di IMDB</a>
            <a href="index.html" class="btn btn-primary">Kembali</a>
        </div>`;
        
        test.insertAdjacentHTML("beforeend", htmlString);
    };
    ourRequest.send();
}
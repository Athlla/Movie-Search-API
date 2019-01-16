var body = document.getElementById('movies');
var keyword = document.getElementById('keyword');
var btn = document.getElementById('btn');

function searchMovie() {
    body.innerHTML = "";
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'http://www.omdbapi.com/?apikey=9e10bb0&s=' + keyword.value);
    ourRequest.onload = function() {
        var ourData = JSON.parse(ourRequest.responseText); //pasing ke objek js
        console.log(ourData);
        var htmlString = `Hasil pencarian untuk <b><i>${keyword.value}</i></b> <br><br> 
        <div class="row">`;
        try {
            for (var i = 0; i < ourData.Search.length; i++) {
                if (ourData.Search[i].Poster != "N/A") {
                    htmlString +=`
                    <div class="col-sm text-center mb-3">
                        <img src=${ourData.Search[i].Poster}></img>
                        <h3>${ourData.Search[i].Title} (${ourData.Search[i].Year})</h3>
                        <a href="#" onclick="getID('${ourData.Search[i].imdbID}')" class="btn btn-primary">Detail</a>
                    </div>
                    `;
                } else {
                    ourData.Search[i].Poster = "error_poster.jpg";
                    htmlString += `
                    <div class="col-sm text-center mb-3">
                        <img src=${ourData.Search[i].Poster}></img>
                        <h3>${ourData.Search[i].Title} (${ourData.Search[i].Year})</h3>
                        <a href="#" onclick="getID('${ourData.Search[i].imdbID}')" class="btn btn-primary">Detail</a>
                    </div>
                    `;
                }
            }
        } catch (error) {
            htmlString = `
            <div class="alert alert-danger" role="alert">
                Film tidak ditemukan! atau Hasil terlalu banyak!
            </div>`;
        }
        htmlString += `</div>`
        body.insertAdjacentHTML("beforeend", htmlString);
    };
    ourRequest.send();
}

// ________________________________________________________________________

function getID(id) {
    sessionStorage.setItem('movieID', id);
    window.location = "detail.html";
    return false;
}

function movieDetail() {
    var test = document.getElementById('body');
    var imdbID = sessionStorage.getItem('movieID');
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'http://www.omdbapi.com/?apikey=9e10bb0&i=' + imdbID);
    ourRequest.onload = function () {
        var ourData = JSON.parse(ourRequest.responseText);
        console.log(ourData);
        var htmlString = "";
        if (ourData.Poster != "N/A") {
            var poster = ourData.Poster;

        } else {
            ourData.Poster = "error_poster.jpg";
            var poster = ourData.Poster;
        }
        htmlString += `
        <div class="row">
            <div class="col-sm-md">
            <h3>${ourData.Title}</h3>
                <img src=${poster} width="300px"></img>
            </div>
            <div class="col-sm">
                <table class="table mt-5">
                    <tr>
                        <td>Released</td>
                        <td>: ${ourData.Released}</td>
                    </tr>
                    <tr>
                        <td>Year</td>
                        <td>: ${ourData.Year}</td>
                    </tr>
                    <tr>
                        <td>Director</td>
                        <td>: ${ourData.Director}</td>
                    </tr>
                    <tr>
                        <td>Actors</td>
                        <td>: ${ourData.Actors}</td>
                    </tr>
                    <tr>
                        <td>Country</td>
                        <td>: ${ourData.Country}</td>
                    </tr>
                    <tr>
                        <td>Genre</td>
                        <td>: ${ourData.Genre}</td>
                    </tr>
                    <tr>
                        <td>Runtime</td>
                        <td>: ${ourData.Runtime}</td>
                    </tr>
                    <tr>
                        <td>Rating</td>
                        <td>: ${ourData.imdbRating}</td>
                    </tr>
                    <tr>
                        <td>Plot</td>
                        <td>: ${ourData.Plot}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div>
            <a href="https://www.imdb.com/title/${ourData.imdbID}" target="_blank" class="btn btn-secondary">Lihat di IMDB</a>
            <a href="index.html" class="btn btn-primary">Kembali</a>
        </div>`;
        
        test.insertAdjacentHTML("beforeend", htmlString);
    };
    ourRequest.send();
}
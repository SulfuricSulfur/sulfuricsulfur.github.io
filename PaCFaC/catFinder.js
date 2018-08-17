"use strict";
var petFinderURL = "https://api.petfinder.com/";

var finderMethod = "pet.find";

var animal = "cat";

var key = "&key=16f1e5af58ba8a7dece94eb5214aab54";

var format = "?format=json";

//setting up variables
//these are the search 
var catLoc;
var age;
var amountshown;
var gender;
var count;

//google maps
var map;
//array of the makers (only5)
var markers = [];
var markerCount = 0;;
var markerIndex = 0;
var infowindow;
var geocoder;


window.onload = init;


function init() {
    
    //setting up the events
    document.querySelector("#gosearch").onclick = loadCatData;

    //setting the search items equal to the previous search results the user did last. (if it isn't their first time)
    if (localStorage.getItem("genderSet") != null) {
        document.querySelector("#genderSelect").value = localStorage.getItem("genderSet");
    }
    if (localStorage.getItem("ageSet") != null) {
        document.querySelector("#ageSelect").value = localStorage.getItem("ageSet");
    }
    if (localStorage.getItem("countSet") != null) {
        document.querySelector("#countSelect").value = localStorage.getItem("countSet");
    }

    //hiding the loading spinner and creating it
    $("#catfactDiv").hide();
    $("#spin").spinner();
    //$("#spin").hide();

    $("#gosearch").click(function() {
        $("#catfactDiv").slideDown(1000, function() {});
    });



}

//setting up the google maps
function mapInit() {
    getGeoLocation();

}

function loadFactData() {

    //https://www.factretriever.com/cat-facts
    //http://cattime.com/cat-facts/kittens/1773-20-cat-facts-to-share-with-kids
    //https://www.thefactsite.com/2016/05/100-cat-facts.html
    //https://www.care.com/c/stories/6045/101-amusing-cat-facts-fun-trivia-about-your/
    var url = "facts.json";

    $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        data: null,
        success: jsonFact,
        error: function(xhr, status, err) {
            console.log(err)
        }

    });
}


function jsonFact(obj) {
    //pick a random cat fact
    var allFacts = obj.CatFacts;
    var randFact = Math.floor(Math.random() * (allFacts.length - 0));

    var fact = allFacts[randFact];
    //display the random cat fact
    var line = "<div class='thefact'><h2 id='catHeader'>Cat Fact!</h2>";

    line += "<p class='catfactlist'>" + fact.fact + "</p> </div>";

    //fade the fact in.
    document.querySelector("#catfactDiv").innerHTML = line;
    $("#catfactDiv").fadeIn(500);

}




function loadCatData() {
    //start the loading screen
    $("#spin").show();

    /*
    
            Used library JQuery-UI http://jqueryui.com/themeroller/

        Spinner gif http://www.jqueryscript.net/loading/Easy-To-Customize-jQuery-Loading-Indicator-Plugin-babypaunch-spinner-js.html
        Used a spinner js in order to show when the page is loading the cats to give feedback.


    
    */
    //get the values from the submit
    age = document.querySelector("#ageSelect").value;
    //breed=document.querySelector("#searchBreed").value;
    catLoc = document.querySelector("#searchLocation").value;
    amountshown = document.querySelector("#countSelect").value;
    gender = document.querySelector("#genderSelect").value;
    count = document.querySelector("#countSelect").value;


    //getting the search parameters the user did to then use next time they use the page.
    localStorage.setItem("genderSet", gender);
    localStorage.setItem("ageSet", age);
    localStorage.setItem("countSet", count);

    //making the url
    var url = petFinderURL;
    url += finderMethod;
    url += format;
    url += key;
    url += "&callback=?";

    //search terms here
    catLoc = catLoc.trim();
    if (catLoc.length < 1) return;

    //encoding the location
    catLoc = encodeURI(catLoc);
    url += "&animal=" + animal;
    url += "&sex=" + gender;
    url += "&age=" + age;
    url += "&count=" + count;
    url += "&location=" + catLoc;


    url += "&output=full";

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: url,
        data: null,
        success: jsonLoaded,
        error: function(xhr, status, err) {
            console.log(err)
        }

    });


}

//used for adding a market
function addMarker(address, name, zip) {
    //var position= {lat:latitude, lng: longitude};
    var lat = "";
    var lng = "";
    var resultMsg=null;
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == 'OK') {
            setMarker(results,name,zip);

        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            setTimeout(function() {
                addMarker(address, name);
            }, 200);
        } 
        //if the address does not work, use zipcode
        else if(status == "ZERO_RESULTS" && zip != null)
            {
                geocoder.geocode({
                'address': zip
                    }, function(results, status) {
                if (status == 'OK') {
                    setMarker(results,name,zip);

                } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    setTimeout(function() {
                        addMarker(address, name);
                    }, 200);
                } 
                else {
                    alert('Geocode not working:' + status);
                }

            });
            }
        else {
            alert('Geocode not working:' + status);
        }


    });
}


//actually setting the market
function setMarker(results, name, zip)
{
    
            var pinImage;
            
        //if the array is clear, add the markers in
            if (markers.length < 5) {
                //upping the count and depending on the number will correspond to the pin icon
                markerCount++;
                switch (markerCount) {
                    case 1:
                        pinImage = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
                        break;
                    case 2:
                        pinImage = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
                        break;
                    case 3:
                        pinImage = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
                        break;
                    case 4:
                        pinImage = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
                        break;
                    case 5:
                        pinImage = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
                        break;
                }
                var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    icon: pinImage
                });
                marker.setTitle(name);
                google.maps.event.addListener(marker, 'click', function(e) {
                    makeInfoWindow(this.position, this.title);
                });
                markers.push(marker);
                zoomOnFirstResult(markerCount-1);
            } else if (markers.length >= 5) {
                if (markerIndex >= 5) {
                    markerIndex = 0;
                }
                if (markerIndex < 5) {
                    var catIndex=markerIndex;
                    if( markers[catIndex].position != null){
                    if (infowindow) infowindow.close();
                    markers[catIndex].position = results[0].geometry.location;
                    markers[catIndex].setTitle(name);
                    google.maps.event.addListener(markers[catIndex], 'click', function(e) {
                       // makeInfoWindow(markers[markerIndex].position, this.title);
                        infowindow.position= markers[catIndex].position;
                        infowindow.content= "<b>" + name+ "</b>";
                    });
                     zoomOnFirstResult(catIndex);
                    markerIndex++;
                    }
                        //ZERO_RESULTS
                }
                //markers[markerIndex].position=position:results[0].geometry.location;


            }
}



//get the geolocation based on the user's location
function getGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, locationError);
    } else {

    }
}


//in case the user hits block, still create a map
function defaultMap() {

    //if the user does not accept to have location, then  still draw the map but give some location for now.
    var latPosition = 0;
    var lngPosition = 0;
    var loc = new google.maps.LatLng(latPosition, lngPosition);
    var mapOtions = {
        //set it to some location
        center: {
            lat: latPosition,
            lng: lngPosition
        },
        zoom: 2,
    }
    map = new google.maps.Map(document.getElementById('mapDiv'), mapOtions);
    geocoder = new google.maps.Geocoder();
    


}

//show the position
function showPosition(position) {
    var latPosition = position.coords.latitude;
    var lngPosition = position.coords.longitude;
    var loc = new google.maps.LatLng(latPosition, lngPosition);
    var mapOtions = {
        center: {
            lat: latPosition,
            lng: lngPosition
        },
        zoom: 15,
    }
    map = new google.maps.Map(document.getElementById('mapDiv'), mapOtions);
    geocoder = new google.maps.Geocoder();

    //takes lat and lng
    geocoder.geocode({
        'latLng': loc
    }, function(result, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            //set the location
            document.querySelector("#searchLocation").value =
                result[0].address_components[3].long_name + " " + result[0].address_components[5].short_name;
        }

    });

}

//making a new window
function makeInfoWindow(position, msg) {
    if (infowindow) infowindow.close();

    //setting up the info window
    infowindow = new google.maps.InfoWindow({
        map: map,
        position: position,
        content: "<b>" + msg + "</b>"
    });
}


//clearing the markers
function clearMarkers() {
    if (infowindow) infowindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);

    }
    markerCount=0;
    markerIndex=0;
    markers = [];
}

//if there  is some sort of error, display it
function locationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            //x.innerHTML = "Permission Denied."
            defaultMap();
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is not available."
            break;
        case error.TIMEOUT:
            x.innerHTML = "Request has timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

//will pan to the new marker that has been set up
function zoomOnFirstResult(index) {
    if (markers.length == 0) return;

    //get the position of the marker and pan to the new one if there is one
    if(markers[index].getPosition() != null){
        map.panTo(markers[index].getPosition());
        map.setZoom(15);
    }

}


function jsonLoaded(obj) {
    //clear the markers if they do a new search
    clearMarkers();
    //console.log("obj stringified = " + JSON.stringify(obj));

    //if there is an error, tell them there was an error
    if (obj.error) {
        var status = obj.status;
        var description = obj.description;
        document.querySelector("#dynamicContent").innerHTML = "<h3><b>Error!</b></h3>" + "<p><i>" + status + "</i><p>" + "<p><i>" + description + "</i><p>";
        $("#dynamicContent").fadeIn(500);
        return; // Bail out
    }

    // if there are no results, print a message and return
    if (obj.total_items == 0) {
        var status = "No results found";
        document.querySelector("#dynamicContent").innerHTML = "<p><i>" + status + "</i><p>" + "<p><i>";
        $("#dynamicContent").fadeIn(500);
        return; // Bail out
    }
    
    //get the main location of the dynamiccontent (where all the cats will be)
    var dynamicContent = document.querySelector("#dynamicContent");
    dynamicContent.innerHTML = "";
    //dynamicContent.fadeOut(500);

    if(obj.petfinder.pets != null){
        var allCats = obj.petfinder.pets.pet;

        var bigLines = "";


        //loop through the pet data
        for (var i = 0; i < allCats.length; i++) {
            var cat = allCats[i];
            var name;
            var h2 = document.createElement('h2');
            //get the name of the cat
            if (cat.name.$t != null) {
                name = cat.name.$t;


            } else {
                //if there is no name, just use no name
                name = "No Name";

            }
            h2.textContent = name;
            dynamicContent.appendChild(h2);

            var catSpace = document.createElement('div');
            catSpace.className = "catSpace";

            //setting up the variables
            var description;
            var address1;
            var address2;
            var zip;
            var image;
            var breed = [];
            var notes = [];

            var line;
            var h3 = document.createElement('h3');
            h3.textContent = name;
            catSpace.appendChild(h3);

            //if there is a photo, get and display the photo
            if (cat.media.photos != null) {
                var img = document.createElement("img");
                if (cat.media.photos.photo != null && cat.media.photos.photo.length > 1) {
                    img.setAttribute("src", cat.media.photos.photo[0].$t);
                } else {
                    img.setAttribute("src", cat.media.photos.photo.$t);

                }
                catSpace.appendChild(img);

            }

            //display the breed
            //depending on if there are multiple breeds, display them differently
            if (cat.breeds.breed != null) {
                var h4 = document.createElement('h4');
                h4.textContent = "Breed(s):";
                catSpace.appendChild(h4);
                var ul = document.createElement('ul');
                if (cat.breeds.breed.length != null && cat.breeds.breed.length > 1) {
                    for (var j = 0; j < cat.breeds.breed.length; j++) {

                        var li = document.createElement('li');
                        li.textContent = cat.breeds.breed[j].$t;
                        ul.appendChild(li);
                    }
                } else {
                    var li = document.createElement('li');
                    li.textContent = cat.breeds.breed.$t;
                    ul.appendChild(li);
                }
                catSpace.appendChild(ul);
            }



            //if there are any options on the cat, display them
            if (cat.options.option != null) {
                var h4 = document.createElement('h4');
                h4.textContent = "Additional Comment(s):";
                catSpace.appendChild(h4);
                var ul = document.createElement('ul');
                if (cat.options.option.length != null && cat.options.option.length > 1) {
                    for (var j = 0; j < cat.options.option.length; j++) {

                        var li = document.createElement('li');
                        li.textContent = cat.options.option[j].$t;
                        ul.appendChild(li);
                    }
                } else {
                    var li = document.createElement('li');
                    li.textContent = cat.options.option.$t;
                    ul.appendChild(li);
                }
                catSpace.appendChild(ul);
            }


            //display the description for the cat if there is one
            var p;
            if (cat.description.$t != null) {
                p = document.createElement('p');
                p.textContent = cat.description.$t;
            } else {
                p = document.createElement('p');
                p.textContent = "No description.";
            }
            catSpace.appendChild(p);


            //if there is a zip
            if (cat.contact.zip != null) {
                //if there is a zip and an address then pass it on through the function
                if (cat.contact.address1.$t != null) {
                    var button = document.createElement("Button");
                    button.setAttribute("id", "cSearch" + i);
                    var addr1 = cat.contact.address1.$t + " " + cat.contact.city.$t + " " + cat.contact.state.$t;
                    pressCatButton(name, addr1, button, cat.contact.zip.$t);
                    button.textContent = "Add Marker";
                    catSpace.appendChild(button);

                    // addMarker(cat.contact.address1.$t,name);
                    //zoomOnFirstResult();
                } else if (cat.contact.address2.$t != null) {
                    var button = document.createElement("Button");
                    button.setAttribute("id", "cSearch" + i);
                    var addr2 = cat.contact.address2.$t + " " + cat.contact.city.$t + " " + cat.contact.state.$t;
                    pressCatButton(name, addr2, button,cat.contact.zip.$t);
                    button.textContent = "Add Marker";
                    catSpace.appendChild(button);

                }
                else{
                    var button = document.createElement("Button");
                    button.setAttribute("id", "cSearch" + i);
                    pressCatButton(name, cat.contact.zip.$t, button, cat.contact.zip.$t);
                    button.textContent = "Add Marker";
                    catSpace.appendChild(button);
                }

            }
            else {
                //if there is not a zip, then just pass in the addresses and say that the zip is null
                if (cat.contact.address1.$t != null) {
                    var button = document.createElement("Button");
                    button.setAttribute("id", "cSearch" + i);
                    var addr1 = cat.contact.address1.$t + " " + cat.contact.city.$t + " " + cat.contact.state.$t;
                    pressCatButton(name, addr1, button, null);
                    button.textContent = "Add Marker";
                    catSpace.appendChild(button);

                    // addMarker(cat.contact.address1.$t,name);
                    //zoomOnFirstResult();
                } else if (cat.contact.address2.$t != null) {
                    var button = document.createElement("Button");
                    button.setAttribute("id", "cSearch" + i);
                    var addr2 = cat.contact.address2.$t + " " + cat.contact.city.$t + " " + cat.contact.state.$t;
                    pressCatButton(name, addr2, button,null);
                    button.textContent = "Add Marker";
                    catSpace.appendChild(button);

                }

            }
            dynamicContent.appendChild(catSpace);

        }
        //we are done loading in the cats, hide the spinner
        $("#spin").hide();
        //document.querySelector("#dynamicContent").innerHTML=bigLines;
        // $(".catSpace").hide();
        $("#dynamicContent").fadeIn(500);
        var options = {};
        // $(".catSpace").show("blind",options,500);

        loadFactData();


        //change the color of the dynamic content box to make it a darker color
        $(function() {
            var state = true;
            if (state) {

                $("#dynamicContent").animate({
                    backgroundColor: "#8a86ab",
                    color: "#3c382c",
                }, 3000);
            }
            state = !state;

        });

        //make the cats display in an accordion style with the name being the header for each
        $(function() {
            $("#dynamicContent").accordion({
                header: 'h2',
                collapsible: true,
                active: false,
                autoHeight: false

            });

            $("#dynamicContent").accordion("refresh");

        });
    }
    else{
         document.querySelector("#dynamicContent").innerHTML = "<h2>No cats found! Try a different location.</h2>";
        $("#spin").hide();
    }

    

}

//pass in the name, address, the button id, and the zip. 
//this will then be passed to create a marker.
function pressCatButton(name, addr, button ,zip) {
    button.onclick = function(e) {
        addMarker(addr, name, zip);
    }
}
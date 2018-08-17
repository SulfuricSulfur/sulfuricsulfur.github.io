"use strict";

(function(){
    
    
    var petFinderURL=  "http://api.petfinder.com/";
    
    var finderMethod = "pet.getRandom";
    
    var animal = "cat";
    
    var key = "&key=16f1e5af58ba8a7dece94eb5214aab54";
    
    var format = "?format=xm";
    
    var location;
    var age;
    var amountshown;
    var gender;
    var count;
    
    window.onload=init;
    
    function init(){
         document.querySelector("#gosearch").onclick=loadCatData;
       //console.log(petfinderURL);
        
    }
    
    
    function loadCatData(){
        var xhr = new XMLHttpRequest();
        var allCats=[];
        xhr.onload = function()
        {
            var html;
            
            //var xml = xhr.responseXML;
            var myJSON = JSON.parse(xhr.responseText);
            var pets= myJSON.pet;
            
            console.dir(pets);
            console.log(pets);
            
            
            
            
            
            
            
        }
        
        var url;
        var url= petFinderURL;
        url += finderMethod;
        url+=format;
        url+= key;
       url+="&callback=?";
        
        $.getJSON('http://api.petfinder.com/pet.getRandom?format=json&key=16f1e5af58ba8a7dece94eb5214aab54&callback=?')
  .done(function(petApiData) { alert('Data retrieved!'); })
  .error(function(err) { alert('Error retrieving data!'); 
});
        
        
        xhr.open('GET',url,true);
        xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2010 00:00:00 GMT");
        xhr.send();
        /*
        age=document.querySelector("#ageSelect").value;
       //breed=document.querySelector("#searchBreed").value;
       location=document.querySelector("#searchLocation").value;
      amountshown=document.querySelector("#countSelect").value;
     gender=document.querySelector("#genderSelect").value;
        count = document.querySelector("#countSelect").value;
        
         //var url;
        var url= petFinderURL;
        url += finderMethod;
        url+=format;
        url+= key;
        url+="&callback=?";
        
        //search terms here
        location = location.trim();
        if(location.length <1)return;
        
        location = encodeURI(location);
        url += "&animal="+animal;
        url+= "&sex="+gender;
        url+="&age="+ age;
        url+="&count=" + count;
        url+="&location="+location;
        
        
        url+="&output=full";
        
          $.ajax({
            dataType:"json",
            url: url,
            data: null,
            success: jsonLoaded,
            
        });
        */
        
    }
    
    
    function jsonLoaded(obj){
        
         console.dir(obj);
		console.log("obj stringified = " + JSON.stringify(obj));
        /*
        if(obj.error){
			var status = obj.status;
			var description = obj.description;
			document.querySelector("#dynamicContent").innerHTML = "<h3><b>Error!</b></h3>" + "<p><i>" + status + "</i><p>" + "<p><i>" + description + "</i><p>";
			$("#dynamicContent").fadeIn(500);
			return; // Bail out
		}
		
		// if there are no results, print a message and return
		if(obj.total_items == 0){
			var status = "No results found";
			document.querySelector("#dynamicContent").innerHTML = "<p><i>" + status + "</i><p>" + "<p><i>";
			$("#dynamicContent").fadeIn(500);
			return; // Bail out
		}
        
       var allCats= obj.petfinder.pets.pet;
        
        for(var i=0; i< allCats.length;i++){
            
            var cat = allCats[i];
            var name;
            var description;
            var address;
            var image;
            var breed=[];
        }
        */
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
})();
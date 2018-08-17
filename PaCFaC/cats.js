"use strict";

var app = app || {};

app.cats={
    petFinderURL: "http://api.petfinder.com/",
    finderMethod: "pet.getRandom",
    //"pet.find",
    format: "?format=json",
    key: "&key=16f1e5af58ba8a7dece94eb5214aab54",
    location:undefined,
    age:undefined,
    breed:undefined,
    animal:"cat",
    amountshown:undefined,
    gender:undefined,
    
    init : function (){
        this.petFinderURL="http://api.petfinder.com/";
        this.finderMethod="pet.getRandom";
        this.key="&key=16f1e5af58ba8a7dece94eb5214aab54";
        this.format="?format=json";
        console.log(this.key);
        document.querySelector("#gosearch").onclick=this.loadCatData;
        
    },
    
    
    loadCatData : function(){
        
       // var url;
         console.log(this.key);
        var url = this.petFinderURL;
        url += this.finderMethod;
        url+=this.format;
        url+= this.key;
        url+="&callback=?";
        
       // this.age=document.querySelector("#ageSelector").value;
       // this.breed=document.querySelector("#searchBreed").value;
       // this.location=document.querySelector("#searchLocation").value;
      //  this.amountshown=document.querySelector("#countSelect").value;
     //   this.gender=document.querySelector("#genderSelect").value;
        
        $.ajax({
            dataType:"jsonp",
            url: url,
            data: null,
            success: jsonLoaded,
            
        });
        
        
    },
    
    jsonLoaded : function(obj){
        console.log("obj = " +obj);
		console.log("obj stringified = " + JSON.stringify(obj));
        /*
        		// if there's an error, print a message and return
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
        
        */
    },
    
    
    
    
};
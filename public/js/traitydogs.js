$(function() {
// ----- Get dogs to show on dogs gallery
   function getDogs(gender){
      var query = new Parse.Query("Dog");
      if (gender!==undefined) query.equalTo("gender", gender);
      query.descending("createdAt");
      query.limit(50);
      query.find({
         success: function(dogs) {
            gallery = "";
            dogs.forEach(function(dog){
               var dogId = dog.id;
               var photoUrl = dog.get("photo");
               var gender = dog.get("gender");
               gallery += getDogThumbnail(dogId, photoUrl, gender);
            });
            $(".dog-gallery").html(gallery);
         },
         error: function(error) {
         // The request failed
         console.error("Error: " + error.code + " " + error.message);
         }
      });
   }

   function getDogThumbnail(dogId, photoUrl, gender){
      if (gender==""){
         gender = "transgender";
      }
      else if (gender=="Macho") {
         gender = "mars";
      }
      else if (gender=="Hembra"){
         gender = "venus";
      }
      return '<div class="col-lg-3 col-md-4 col-xs-6"><a class="thumbnail image" data-id="'+dogId+'" href="#"><img class="img-responsive" src="'+photoUrl+'" alt=""><h2><span><i class="fa fa-'+gender+'"></i></span></h2></a></div>';
   }
// ----- Filter Dogs by gender
   $("#dog-filter").on('change', function(){
      var gender = $("#dog-filter option:selected").text();
      getDogs(gender);
   });

// ----- Get a dog to show on Modal window
   $(document).on('click', '.thumbnail', function(e){
      e.preventDefault();
      var dogId = $(this).attr("data-id");
      getDogInformation(dogId);
      $('#dog-modal-show').modal('toggle');
   });

   function getDogInformation(dogId){
      var query = new Parse.Query("Dog");
      query.get(dogId, {
         success: function(dog) {
            var name = dog.get("name");
            var photoUrl = dog.get("photo");
            var gender = dog.get("gender");
            var race = dog.get("race");
            var pedigree = dog.get("pedigree");
            var pedigree = pedigree ? "Con pedigree" : "Sin pedigree";
            var bornDate = dog.get("born");
            var age = getAge(bornDate);
            var city = dog.get("city");
            var username = dog.get("username");
            var useremail = dog.get("useremail");
            var contact = username + " ("+useremail+")";
            showDogModalWindow(name, photoUrl, gender, race, pedigree, age, city, contact);
         },
         error: function(error) {
            // The request failed
            console.error("Error: " + error.code + " " + error.message);
         }
      });
   }

   function showDogModalWindow(name, photoUrl, gender, race, pedigree, age, city, contact){
      $("#dog-modal-show .dog-name").html(name);
      $("#dog-modal-show .dog-image").attr("src", photoUrl);
      var informationList = getDogInformationList(gender, race, pedigree, age, city, contact);
      $("#dog-modal-show .dog-information").html(informationList);
   }

   function getDogInformationList(gender, race, pedigree, age, city, contact){
      var list = "";
      list += '<li class="list-group-item">'+gender+'</li>';
      list += '<li class="list-group-item">'+race+'</li>';
      list += '<li class="list-group-item">'+pedigree+'</li>';
      list += '<li class="list-group-item">'+age+'</li>';
      list += '<li class="list-group-item">'+city+'</li>';
      list += '<li class="list-group-item">'+contact+'</li>';
      return list;
   }

   function getAge(bornDate){
      var dateToday = new Date();
      var diferenceWithToday = (dateToday.getFullYear()-bornDate.getFullYear())+" años";//moment(dateToday).diff(moment(bornDate)).format("YY")+" años";
      return diferenceWithToday;
   }

// ----- Upload dog on Modal window

   $(".topnav .upload-dog").on('click', function(e){
      e.preventDefault();
      $('#dog-modal-upload').modal('toggle');
   });

   $("#dog-modal-upload #dog-btn-upload").on('click', function(){
      uploadPhoto();
   });

   function saveDog(photoUrl) {
      var ref = $("#dog-modal-upload");

      var name = ref.find("#dog-name").val();
      //var photoUrl = "http://feminspire.com/wp-content/uploads/2013/05/PIN-FOREVERALONE-01.jpg"; // ????? falta poder subir una foto
      var gender = ref.find("#dog-gender option:selected").text();
      var bornDate = ref.find("#dog-born").val();
      var born = moment(bornDate).toDate();
      var race = ref.find("#dog-race option:selected").text();
      var pedigree = ref.find('#dog-pedigree').prop('checked');     
      var username = ref.find("#user-name").val();
      var useremail = ref.find("#user-email").val();
      var locality = ref.find("#address_components .locality").html();
      var region = ref.find("#address_components .region").html();
      var city = locality+", "+region;
      var location = []; // ????? falta coger la location

      var Dog = Parse.Object.extend("Dog");
      var dog = new Dog();
       
      dog.save({
        name: name,
        photo: photoUrl,
        gender: gender,
        born: born,
        race: race,
        pedigree: pedigree,
        username: username,
        useremail: useremail,
        city: city
      }, {
        success: function(dog) {
         getDogs();
         alert("Woaf!!, "+name+" añadido con éxito");
        },
        error: function(dog, error) {
          // The request failed
         console.error("Error: " + error.code + " " + error.message);
        }
      });
   }

   var file;

   $('#dog-photo').bind("change", function(e) {
      var files = e.target.files || e.dataTransfer.files;
      // Our file var now holds the selected file
      file = files[0];
   });

   function uploadPhoto() {
      var serverUrl = 'https://api.parse.com/1/files/' + file.name;

      $.ajax({
        type: "POST",
        beforeSend: function(request) {
          request.setRequestHeader("X-Parse-Application-Id", 'D9V5hkDmqPf2beWiXe2oyHohNLqghx5FmoyY11th');
          request.setRequestHeader("X-Parse-REST-API-Key", 'A35jaBDGmBmzskSbt0CedrpAQqjycvZ8nkuxaL8E');
          request.setRequestHeader("Content-Type", file.type);
        },
        url: serverUrl,
        data: file,
        processData: false,
        contentType: false,
        success: function(data) {
          console.log("Foto subida a: " + data.url);
          saveDog(data.url);
        },
        error: function(data) {
          alert("Error al subir tu foto");
          var obj = jQuery.parseJSON(data);
          console.error(obj.error);

        }
      });
   }

// ----- Initialize
   function initAutocomplete() {
     var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"), {
        types: ["geocode"]
      });
      google.maps.event.addListener(autocomplete, "place_changed", function() {
        var addplace = autocomplete.getPlace();
        $('#autocomplete').val(addplace.formatted_address);
        $('#address_components').html(addplace.adr_address);
      });
   }

   function initialize(){
      Parse.initialize("D9V5hkDmqPf2beWiXe2oyHohNLqghx5FmoyY11th", "oTKz3eemuJo0r9njdcD89btqHAxuw5lRIFa0YPs5");      
      getDogs(undefined);
      initAutocomplete();
   }
   initialize();
});
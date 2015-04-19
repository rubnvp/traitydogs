$(function() {
// ----- Get dogs to show on dogs gallery
   function getDogs(){
      var query = new Parse.Query("Dog");
      query.include("user");
      query.find({
         success: function(dogs) {
            gallery = "";
            dogs.forEach(function(dog){
               var dogId = dog.id;
               var photoUrl = dog.get("photo");
               gallery += getDogThumbnail(dogId, photoUrl);
            });
            $(".dog-gallery").html(gallery);
            dogs
         },
         error: function(error) {
         // The request failed
         console.error("Error: " + error.code + " " + error.message);
         }
      });
   }

   function getDogThumbnail(dogId, photoUrl){
      return '<div class="col-lg-3 col-md-4 col-xs-6"><a class="thumbnail" data-id="'+dogId+'" href="#"><img class="img-responsive" src="'+photoUrl+'" alt=""></a></div>';
   }

// ----- Get a dog to show on Modal window
   $(document).on('click', '.thumbnail', function(e){
      e.preventDefault();
      var dogId = $(this).attr("data-id");
      getDogInformation(dogId);
      $('#dog-modal-show').modal('toggle');
   });

   function getDogInformation(dogId){
      var query = new Parse.Query("Dog");
      query.include("user");
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
            var user = dog.get("user");
            var contact = getContact(user);
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

   function getContact(user){
      var name = user.get("username");
      var email = user.get("email");
      return name+" ("+email+")";
   }

// ----- Upload dog on Modal window

   $(".topnav .upload-dog").on('click', function(e){
      e.preventDefault();
      $('#dog-modal-upload').modal('toggle');
   });

// ---- Initialize
   function initialize(){
      Parse.initialize("D9V5hkDmqPf2beWiXe2oyHohNLqghx5FmoyY11th", "oTKz3eemuJo0r9njdcD89btqHAxuw5lRIFa0YPs5");
      getDogs();
   }
   initialize();
});
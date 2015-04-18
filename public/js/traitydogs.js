$(function() {
  
   $('.thumbnail').on('click', function(e) {
      e.preventDefault();
      $('#modalShowDog').modal('toggle');
   });   

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
         },
         error: function(error) {
         // The request failed
         console.error("Error: " + error.code + " " + error.message);
         }
      });
   }

   function getDogThumbnail(dogId, photoUrl){
      return '<div class="col-lg-3 col-md-4 col-xs-6"><a class="thumbnail" href="#"><img class="img-responsive" data-id="'+dogId+'" src="'+photoUrl+'" alt=""></a></div>';
   }

   function initialize(){
      Parse.initialize("D9V5hkDmqPf2beWiXe2oyHohNLqghx5FmoyY11th", "oTKz3eemuJo0r9njdcD89btqHAxuw5lRIFa0YPs5");
      getDogs();
   }

   initialize();
});
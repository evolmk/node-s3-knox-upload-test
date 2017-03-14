(function(){
  var app = angular.module('myApp', ['ngRoute']);

  app.controller('homeController',function(){
    console.log("controller initialized");
  });
})();
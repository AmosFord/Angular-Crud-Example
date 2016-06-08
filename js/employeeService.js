(function() {
  'use strict';

  angular
    .module('app')
    .service('employeeService', ['$http', function ($http) {
      var jsonLoc = 'http://localhost:5984/employees';

      this.getEmployees = function() {
        var service = $http({
          method: 'GET',
          url: jsonLoc + '/_all_docs',
          params: {
                include_docs: true
            },
            isArray:true,
            transformResponse:function(data) {
                var returnOb = angular.fromJson(data);
                console.log("look", returnOb.rows);
                return returnOb.rows;
            }          
        }).then(function(response) {
              console.log("coming from servicejs", response.data);
              //return data when promise resolved
              //that would help you to continue promise chain.
              return response.data;
            });
    return service; 
      };

      this.addEmployee = function() {
        var service = $http({
          method: 'POST',
           headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
          url: jsonLoc,
        });
        return service;
      };

      this.editEmployee = function(selectedEmployee) {
        var service = $http({
          method: 'PUT',
           headers: { 
              'Accept': 'application/json',
              'Content-Type': 'application/json' 
          },
          url: jsonLoc + '/' + selectedEmployee._id
        });
        return service;
      };

      this.delEmployee = function(selectedEmployee) {
        var service = $http({
          method: 'DELETE',
          url: jsonLoc + '/' + selectedEmployee._id + '?rev=' + selectedEmployee._rev
        });
        return service;
      };
  }]);
})();
(function() {
  'use strict';

  angular
    .module('app')
    .service('employeeService', ['$http', function ($http) {
      var jsonLoc = 'http://localhost:5984/employees';

      this.getEmployees = function() {
        var service = $http({
          method: 'GET',
          url: jsonLoc
        });
        return service;
      };

      this.setEmployee = function(selectedEmployee) {
        var service = $http({
          method: 'POST',
          url: jsonLoc,
          data: selectedEmployee
        });
        return service;
      };

      this.editEmployee = function(selectedEmployee) {
        var service = $http({
          method: 'PUT',
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
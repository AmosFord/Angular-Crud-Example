angular.module('app', ['ngResource','ngRoute','ui.bootstrap'])
     
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/employees.html',
                controller: 'Home'
            }).
            when('/employee/:employeeId', {
                templateUrl: 'views/employee.html',
                controller: 'Employee'
            }).
            otherwise({
                redirectTo: '/'
            });
        }]
    )
     
// listing controller
    .controller('Home', function($scope, Employees) {
        Employees.getAll(function(ob) {
            $scope.employees = ob;
        });
    })
     
    .controller('Employee', function($scope) {
         
    })

//Employee factory
.factory('Employee', function () {
 
  /**
   * Constructor, with class name
  */
  function Employee(_id, firstName, lastName, middleName, age, designation, salary) {
    // Public properties, assigned to the instance ('this')
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middlename = middlename;
    this.age = age;
    this.designation = designation;
    this.salary = salary;
  }
 
  /**
   * Public method, assigned to prototype
   */
  Employee.prototype.getFullName = function () {
    return this.firstName + ' ' + this.lastName + ', ' + this.designation;
  };
 
  /**
   * Private property
   */
  var possibleDesignations = ['Snr. Manager', 'Manager', 'Asst. Manager', 'Lead', 'Snr. Consultant', 'Consultant'];
 
  /**
   * Private function
   */
  function checkDesignation(designation) {
    return possibleDesignations.indexOf(designation) !== -1;
  }
 
  /**
   * Static property
   * Using copy to prevent modifications to private property
   */
  Employee.possibleDesignations = angular.copy(possibleDesignations);
 
  /**
   * Static method, assigned to class
   * Instance ('this') is not available in static context
   */
  Employee.build = function (data) {
    if (!checkDesignation(data.designation)) {
      return;
    }
    return new Employee(
      data._id,
      data.first_name,
      data.last_name,
      data.middlename,
      data.age,
      data.designation,
      data.salary
    );
  };
 
  /**
   * Return the constructor function
   */
  return Employee;
})


// add to my app.angular.js file
.factory('Employees', function($resource) {
 
    var Methods = {
        'getAll': {
            'method':'GET',
            'url':'http://localhost:5984/employees/_all_docs',
            'params': {
                'include_docs':true
            },
            'isArray':true,
            'transformResponse':function(data) {
                var returnOb = angular.fromJson(data);
                return returnOb.rows;
            }
        }
    };
     
    var Employees = $resource('http://localhost:5984/employees/:id',{'id':'@id'},Methods);
     
    return Employees;
})
;

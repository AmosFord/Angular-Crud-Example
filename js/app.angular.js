angular.module('app', ['ngResource','ngRoute','ui.bootstrap','ui.router'])
     
  /*  .config(['$routeProvider', function($routeProvider) {
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
    )*/
  .config(function ($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/employees.html',
        controller: 'Home',
        controllerAs: 'home'
      })
      .state('add', {
        url: '/employee/{employeeId}',
        templateUrl: 'views/employee.html',
        controller: 'Employee',
        controllerAs: 'employee'
      })
      .state('main.edit', {
        url: '/employee/{employeeId}',
        templateUrl: 'views/employee.html',
        controller: 'Employee',
        controllerAs: 'employee'
      })
      .state('main.delete', {
        url: '/delete/:employeeId',
        templateUrl: 'views/delete.html',
        controller: 'Employee',
        controllerAs: 'employee'
      });

  })
// listing controller
  .controller('Home', function($scope,$http, Employees, employeeService) {
        Employees.getAll(function(ob) {
            $scope.employees = ob;
        });
    /*function refreshData() {
       var emps = employeeService.getEmployees();
        emps.then(function (data) {
            $scope.employees = data.doc;
        })
       
    }
    refreshData();*/
    })
//Employee factory
.factory('Employee', function () {
 
  /**
   * Constructor, with class name
  */
  function Employee(firstName, lastName, middleName, age, designation, salary) {
    // Public properties, assigned to the instance ('this')
   /** '_id':null,
    'setId' : function() { 
      this._id = encodeURIComponent((this.fistName + '_' + this.middleName + '_' + this.lastName + '_' + this.designation).replace(' ', '_'));
    },
    */
    this._id = encodeURIComponent((this.fistName + '_' + this.middleName + '_' + this.lastName + '_' + this.designation).replace(' ', '_'));
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
  //return Employee;
  return {
       '_id':null,
       'setId' : function() { 
             this._id = encodeURIComponent((this.fistName + '_' + this.middleName + '_' + this.lastName + '_' + this.designation).replace(' ', '_'));
        },
        'firstName' : '',
        'middleName' : '',
        'age' : '',
        'designation' : '',
        'salary' : ''
    };
})

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

.controller('Employee', function($scope, $location, Employees, Employee, $stateParams, employeeService) {
    $scope.edit = false;
     
    if( $stateParams.employeeId == 'new' )
    {
        $scope.employee = new Employees(Employee);
        $scope.employee.edit = true;
    }
    else
    {
        getEmployee()
    }
     
   $scope.save = function() {
        if( $stateParams.employeeId == 'new' )
        {
            $scope.employee.setId();
            $scope.employee.$save().then(function() {
                $location.path('/');
            });
        }
        else
        {
            $scope.employee.$save().then(function() {
                $location.path('/');
            })
             
            $scope.edit = false;
        }
    }
    //add employee
    /* 
    $scope.save = function() {
        employeeService.addEmployee()
        .success(function() {
          console.log('Employee Added');
          $location.path('/');
        })
        .error(function() {
          console.log('Error carrying out request');
          $location.path('/');
        });
      };*/

       //delete employee
    $scope.remove = function() {
        employeeService.delEmployee($scope.employee)
        .success(function() {
          console.log('Employee Deleted');
          $location.path('/');
        })
        .error(function() {
          console.log('Error carrying out request');
        });
      };

            // Edit an Employee
      $scope.edit = function() {
        employeeService.editEmployee($scope.employee)
        .success(function() {
          console.log('Employee Updated');
          $location.path('/');
        })
        .error(function() {
          console.log('Error carrying out request');
        });
      };

   /* $scope.remove = function() {
            $scope.employee._deleted = true;
            $scope.employee.$save().then(function() {
                $location.path('/');
            });
           /* $http.delete('http://localhost:5984/employees/:id',{'id':'@id'})
            $scope.employee.removeEmployee.then(function() {
                $location.path('/');
            });
    } add comment back up higher */
    

    $scope.toggleEdit = function() {
        if( $stateParams.employeeId == 'new' )
        {
            $location.path('/');
        }
        else
        {
            $scope.edit = $scope.edit ? false : true;
        }
    }
     
    function getEmployee() {
        Employees.get({id:$stateParams.employeeId}, function(employee) {
            $scope.employee = employee;
        });
    }
})

.controller('myCtrl', function($scope) {
    var possibleDesignations = ['Snr. Manager', 'Manager', 'Asst. Manager', 'Lead', 'Snr. Consultant', 'Consultant'];
    var possibleSalaryRanges = [["100000","130000"],
                      ["90000","99999"],
                      ["80000","89999"],
                      ["60000","79999"],
                      ["50000","59000"],
                      ["40000","49000"]];
    $scope.designations = possibleDesignations;
    $scope.salaryRanges = []; // we'll get these later
    $scope.getSalaryRanges = function(){
        // just some silly stuff to get the key of what was selected since we are using simple arrays.
        var key = $scope.designations.indexOf($scope.employee.designation);
        // Here you could actually go out and fetch the options for a server.
        var myNewOptions = possibleSalaryRanges[key];
        // Now set the options.
        // If you got the results from a server, this would go in the callback
        $scope.salaryRanges = myNewOptions;
    };
})
.controller('tableCtrl', function($scope, $location, $routeParams, $stateParams) {
    $scope.idSelectedEmployee = null;

    $scope.setSelected = function (selectedEmployee) {
      $scope.idSelectedEmployee = selectedEmployee;
    };    
    $scope.editSelected = function () {
      var earl = '/employee/' +  $scope.idSelectedEmployee;
      $location.path(earl);
    };  
});

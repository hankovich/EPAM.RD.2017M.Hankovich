angular.module('books', ['ngRoute', 'ngSanitize'])
    .controller('IndexController', [
        '$scope', 'dataService', '$http', function ($scope, dataService, $http) {

            $scope.addImg = function (name, src, album, description) {
                if (name === '' || src === '' || album === '' || description === '')
                    alert('All fields are required!');

                dataService.addImg(name, src, album, description);
            }

            dataService.getAll().then(function (response) {
                $scope.albums = response.data;
            });

            
            $scope.filemode = true;

            $scope.setFilemode = function (value) {
                if ($scope.filemode !== value) {
                    $scope.filemode = value;
                    if (value === false) {
                        document.getElementById("file").value = "";
                        $scope.user.src = '';
                    } else
                        $scope.user.src = '';
                }
            }

            $scope.remove = function (index, albumName, photoId) {
                dataService.remove(albumName, photoId).then(function(response) {

                    if (response.data) {
                        for (var i = 0; i < $scope.albums.length; i++) {
                            if ($scope.albums[i].albumName === albumName) {
                                $scope.albums[i].photos.splice(index, 1);
                            }
                        }
                        alert('success');
                    } else {
                        alert('fail');
                    }
                });
            };

            $scope.user = {
                name: "",
                src: "",
                album: ""
            };

            
        }
    ])
    .controller('RegisterController', ['$scope', '$rootScope', 'accountService', '$location', function ($scope, $rootScope, accountService, $location) {
        $rootScope.newDescr = $rootScope.descr;
        $rootScope.descrEditMode = false;
        $rootScope.editDescr = function () {
            $rootScope.descrEditMode = true;
        }

        $rootScope.saveDescr = function (newDescr) {
            accountService.editDescr(newDescr);
            $rootScope.descrEditMode = false;
            $rootScope.descr = newDescr;
            //accountService.descr().then(function (response) {
            //    $rootScope.descr = response.data;
            //});
        }

        accountService.descr().then(function(response) {
            $rootScope.descr = response.data;
        });

        $rootScope.isAuthenticated = false;

        $rootScope.registerModel = {
            login: "",
            password: ""
        }

        $rootScope.registerUser = function () {
            accountService.register($rootScope.registerModel).then(function (response) {
                accountService.login($rootScope.registerModel).then(function () {
                    accountService.isAuthenticated().then(function (response) {
                        $rootScope.isAuthenticated = response.data;
                        if ($rootScope.isAuthenticated) {

                            accountService.userName().then(function (response) {
                                $rootScope.userName = response.data;
                            });

                            //$location.url('/AngularRoute/Gallery');
                        }
                    });
                });
            });
        }

        $rootScope.logoff = function () {
            accountService.logoff().then(function () {
                accountService.isAuthenticated().then(function (response) {
                    $rootScope.isAuthenticated = response.data;
                });
                accountService.isInRole('Admin').then(function (response) {
                    $rootScope.isInAdminRole = response.data;
                });
            });
            //$location.url('/AngularRoute/Index');
        }

        $rootScope.login = function () {
            accountService.login($rootScope.registerModel).then(function (response) {
                accountService.isAuthenticated().then(function (response) {
                    $rootScope.isAuthenticated = response.data;
                    if ($rootScope.isAuthenticated) {
                        $rootScope.registerModel.password = $rootScope.registerModel.login = '';
                    }
                });
                accountService.userName().then(function (response) {
                    $rootScope.userName = response.data;
                });
                accountService.isInRole('Admin').then(function (response) {
                    $rootScope.isInAdminRole = response.data;
                });
            });
            //$location.url('/AngularRoute/Index');
        }

        accountService.userName().then(function (response) {
            $rootScope.userName = response.data;
        });

        accountService.isAuthenticated().then(function (response) {
            $rootScope.isAuthenticated = response.data;
        });

        accountService.isInRole('Admin').then(function(response) {
            $rootScope.isInAdminRole = response.data;
        });

        }])
    .service('dataService', [
        '$http', function ($http) {

            function getAll() {
                var response = $http({
                    url: '/Home/GetAlbums'
                });
                return response;
            }

            function add(name, src, albumName, description) {

                var response = $http({
                    method: 'POST',
                    url: '/Home/AddImg',
                    data: {
                        name: name,
                        src: src,
                        albumName: albumName,
                        description: description
                    },
                    header: { 'Accept': 'application/json' }
                });
            };

            function remove(albumName, photoId) {
                var request = {
                    method: 'POST',
                    url: '/Home/RemoveImg',
                    data: { albumname: albumName, photoid: photoId }
                };

                return $http(request);
            };

            return {
                getAll: getAll,
                addImg: add,
                remove: remove
            }
        }
    ])
    .service('accountService', ['$http', function ($http) {
        var register = function (registerForm) {
            var request = {
                method: "POST",
                url: "/Account/Register/",
                data: {
                    login: registerForm.login,
                    password: registerForm.password
                },
                headers: { 'Accept': 'application/json' }
            }
            return $http(request);
        };

        var isInRole = function (roleName) {
            var response = {
                method: "POST",
                url: "/Account/IsInRole/",
                data: {role: roleName},
                headers: { 'Accept': 'application/json' }
            }
            return $http(response);
        };

        var isAuthenticated = function () {
            var response = {
                method: "POST",
                url: "/Account/IsAuthenticated/",
                headers: { 'Accept': 'application/json' }
            }
            return $http(response);
        };

        var userName = function () {
            var response = {
                method: "POST",
                url: "/Account/UserName/",
                headers: { 'Accept': 'application/json' }
            }
            return $http(response);
        };

        var login = function (registerForm) {
            var response = {
                method: "POST",
                url: "/Account/Login/",
                data: {
                    login: registerForm.login,
                    password: registerForm.password
                },
                headers: { 'Accept': 'application/json' }
            }
            return $http(response);
        };

        var logoff = function () {
            var response = {
                method: "POST",
                url: "/Account/LogOff/",
                headers: { 'Accept': 'application/json' }
            }
            return $http(response);
        };

        function descr() {
            var response = {
                method: "POST",
                url: "/Account/Description/",
                headers: { 'Accept': 'application/json' }
            }
            return $http(response);
        }


        function editDescr(newDescr) {
            var response = {
                method: "POST",
                url: "/Account/ChangeDescription/",
                data: {newDescription: newDescr},
                headers: { 'Accept': 'application/json' }
            }
            return $http(response);
        }


        return {
            register: register,
            logoff: logoff,
            login: login,
            isAuthenticated: isAuthenticated,
            userName: userName,
            isInRole: isInRole,
            descr: descr,
            editDescr: editDescr
        }
    }])
    .config([
        '$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
            $routeProvider
                .when('/AngularRoute/', {
                    templateUrl: '/',
                    controller: 'IndexController'
                })
                .when('/AngularRoute/Gallery/', {
                    templateUrl: '/Views/Home/Gallery.html',
                    controller: 'IndexController'
                })
                .when('/AngularRoute/Add/', {
                    templateUrl: '/Views/Home/Add.html',
                    controller: 'IndexController'
                })
                .when('/AngularRoute/Index/', {
                    templateUrl: '/Views/Home/Index.html',
                    controller: 'IndexController'
                })
                .when('/AngularRoute/Register/',
                {
                    templateUrl: '/Views/Account/Register.html',
                    controller: 'RegisterController'
                })
                .otherwise({
                    redirectTo: '/'
                });

            $locationProvider.html5Mode(true);
        }
    ])
    .directive('previewImg', [
        function () {
            return {
                restrict: 'E',
                replace: true,
                scope: { name: '=', src: '=', album: '=', date: '=', description: '=', preview: '=', remove: '=', index: '=', photoid: '=' },
                templateUrl: '/Views/Home/Preview.html'
            }
        }
    ])
    .directive("fileChange", [function () {
        return {
            scope: {
                fileChange: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileChange = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }])
    .directive('dateNow', ['$filter', function ($filter) {
        return {
            link: function ($scope, $element, $attrs) {
                $element.text($filter('date')(new Date(), $attrs.dateNow));
            }
        };
    }])
.filter('formatText', function () {
    return function (input) {
        if (!input) return input;
        var output = input
          //replace possible line breaks.
          .replace(/(\r\n|\r|\n)/g, '<br/>')
          //replace tabs
          .replace(/\t/g, '&nbsp;&nbsp;&nbsp;')
          //replace spaces.
          .replace(/ /g, '&nbsp;');

        return output;
    };
});
    ;
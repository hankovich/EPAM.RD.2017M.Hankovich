angular.module('books', ['ngRoute'])
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
    .controller('RegisterController', ['$scope', 'accountService', '$location', function ($scope, accountService, $location) {
        $scope.newDescr = $scope.descr;
        $scope.descrEditMode = false;
        $scope.editDescr = function () {
            $scope.descrEditMode = true;
        }

        $scope.saveDescr = function (newDescr) {
            accountService.editDescr(newDescr);
            $scope.descrEditMode = false;
            $scope.descr = accountService.descr();
        }

        $scope.descr = accountService.descr();

        $scope.isAuthenticated = false;

        $scope.registerModel = {
            login: "",
            password: ""
        }

        $scope.registerUser = function () {
            accountService.register($scope.registerModel).then(function(response) {
                accountService.login($scope.registerModel).then(function () {
                    accountService.isAuthenticated().then(function(response) {
                        $scope.isAuthenticated = response.data;
                        if ($scope.isAuthenticated) {

                            accountService.userName().then(function(response) {
                                $scope.userName = response.data;
                            });

                            $location.url('/AngularRoute/Gallery');
                        }
                    });
                });
            });
            $scope.$evalAsync();


        }

        $scope.logoff = function () {
            accountService.logoff().then(function() {
                accountService.isAuthenticated().then(function(response) {
                    $scope.isAuthenticated = response.data;
                });
            });
        }

        $scope.login = function() {
                accountService.login($scope.registerModel).then(function(response) {
                    accountService.isAuthenticated().then(function(response) {
                        $scope.isAuthenticated = response.data;
                        if ($scope.isAuthenticated) {
                            $scope.registerModel.password = $scope.registerModel.login = '';
                        }
                    });
                    accountService.userName().then(function(response) {
                        $scope.userName = response.data;
                    });
                });
            }

        accountService.userName().then(function(response) {
        $scope.userName = response.data;
        });

        accountService.isAuthenticated().then(function (response) {
            $scope.isAuthenticated = response.data;
        });

        $scope.isInRole = function(roleName) {
            accountService.isInRole(roleName).then(function(response) {
                return response;
            });
        };
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

        var text = "Descr";

        function descr() {
            return text;
        }


        function editDescr(newDescr) {
            text = newDescr;
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
    ;
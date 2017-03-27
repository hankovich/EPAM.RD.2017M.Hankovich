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

            $scope.descrEditMode = false;

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

            $scope.editDescr = function () {
                $scope.descrEditMode = true;
            }

            $scope.saveDescr = function (newDescr) {
                dataService.editDescr(newDescr);
                $scope.descrEditMode = false;
                $scope.descr = dataService.descr();
            }

            $scope.descr = dataService.descr();

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
                album: "",
                descripton: ""
            };

            $scope.newDescr = $scope.descr;
        }
    ])
    .controller('RegisterController', ['$scope', 'accountService', function ($scope, accountService) {
        $scope.registerModel = {
            login: "",
            password: "",
            confPass: ""
        }

        $scope.registerUser = function () {
            accountService.register($scope.registerModel).then(function (response) {
                alert(response.data);
            });

            $scope.isAuthenticated = accountService.isAuthenticated();
        }

        $scope.logoff = function () {
            accountService.logoff();
        }

        $scope.login = function () {
            accountService.login($scope.registerModel);
        }
    }])
    .service('dataService', [
        '$http', function ($http) {

            var text = "Descr";

            function descr() {
                return text;
            }

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

            function editDescr(newDescr) {
                text = newDescr;
            }

            return {
                getAll: getAll,
                addImg: add,
                remove: remove,
                descr: descr,
                editDescr: editDescr
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

        var isAuthenticated = function () {
            var response = {
                method: "POST",
                url: "/Account/IsAuthenticated/",
                headers: { 'Accept': 'application/json' }
            }
            $http(response).then(function (response) {
                return response.data;
            });
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
            $http(response);
        };

        var logoff = function () {
            var response = {
                method: "POST",
                url: "/Account/LogOff/",
                headers: { 'Accept': 'application/json' }
            }
            $http(response);
        };

        return {
            register: register,
            logoff: logoff,
            login: login,
            isAuthenticated: isAuthenticated
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
                .when('/AngularRoute/EditDescription/', {
                    templateUrl: '/Views/Home/EditDescription.html',
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
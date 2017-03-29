angular.module('books', ['ngRoute', 'ngSanitize'])
    .controller('IndexController', [
        '$scope', 'dataService', 'accountService', '$http', function ($scope, dataService, accountService, $http) {
            $scope.addImg = function (name, src, album, description) {
                if (name === '' || src === '' || album === '' || description === '')
                    alert('All fields are required!');

                dataService.addImg(name, src, album, description);
            }

                $scope.cart = [];

            dataService.getCart().then(function(response) {
                $scope.cart = response.data;
            });

            accountService.isAuthenticated().then(function (response) {
                $scope.isAuthenticated = response.data;
            });

            $scope.inCart = function (photoid) {
                //dataService.getCart().then(function (response) {
                 //   $scope.cart = response.data;
                //});
                for (var i = 0; i < $scope.cart.length; i++) {
                    if ($scope.cart[i].Id === photoid)
                        return true;
                }
                return false;
            }

            $scope.deleteFromCart = function (photoid, $event) {
                $event.stopPropagation();
                dataService.deleteFromCart(photoid).then(function(response) {
                    for (var i = 0; i < $scope.cart.length; i++) {
                        if ($scope.cart[i].Id === photoid)
                            $scope.cart.splice(i, 1);
                    }
                });
            }
        
            $scope.addToCart = function (photo, $event) {
                $event.stopPropagation();
                dataService.addToCart(photo.Id).then(function (response) {
                    $scope.cart = $scope.cart || [];
                    $scope.cart.push(photo);
                });
            }

            dataService.getAll().then(function (response) {
                $scope.allAlbums = response.data;
                $scope.extensions = [];
                for (var i = 0; i < $scope.allAlbums.length; i++) {
                    for (var j = 0; j < $scope.allAlbums[i].photos.length; j++) {
                        $scope.allAlbums[i].photos[j].isMaxSize = false;
                        if (!$scope.extensions.includes($scope.allAlbums[i].photos[j].src.substring($scope.allAlbums[i].photos[j].src.lastIndexOf('.') + 1))) {
                            $scope.extensions.push($scope.allAlbums[i].photos[j].src.substring($scope.allAlbums[i].photos[j].src.lastIndexOf('.') + 1));
                        }
                    }
                }
            });

            $scope.setMaxSize = function (photo) {
                for (var i = 0; i < $scope.allAlbums.length; i++) {
                    for (var j = 0; j < $scope.allAlbums[i].photos.length; j++) {
                        if ($scope.allAlbums[i].photos[j].Id !== photo.Id) {
                            $scope.allAlbums[i].photos[j].isMaxSize = false;
                        }
                    }
                }
                photo.isMaxSize = !photo.isMaxSize;
            }
            
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

            $scope.remove = function (index, albumName, photoId, $event) {
                $event.stopPropagation();
                dataService.remove(albumName, photoId).then(function(response) {

                    if (response.data) {
                        for (var i = 0; i < $scope.allAlbums.length; i++) {
                            if ($scope.allAlbums[i].albumName === albumName) {
                                $scope.allAlbums[i].photos.splice(index, 1);
                            }
                        }
                        //alert('success');
                    } else {
                       // alert('fail');
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
            $location.url('/AngularRoute/Gallery');
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
            $location.url('/AngularRoute/Gallery');
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
        '$http', function($http) {

                function getAll() {
                    var response = $http({
                        url: '/Home/GetAlbums',
                        headers: { 'Accept': 'application/json' }
                    });
                    return response;
                }

                function getCart() {
                    var response = $http({
                        url: '/Account/GetUserCart',
                        headers: { 'Accept': 'application/json' }
                    });
                    return response;
                }

                function addToCart(photoid) {
                    var response = $http({
                        method: 'POST',
                        url: '/Account/AddPhotoToCart/',
                        data: { photoId: photoid },
                        headers: { 'Accept': 'application/json' }
                    });
                    return response;
                }

                function deleteFromCart(photoid) {
                    var response = $http({
                        method: 'POST',
                        url: '/Account/DeletePhotoFromCart',
                        data: { photoId: photoid },
                        headers: { 'Accept': 'application/json' }
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
                    remove: remove,
                    getCart: getCart,
                    addToCart: addToCart,
                    deleteFromCart: deleteFromCart
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
                .when('/AngularRoute/Cart/',
                {
                    templateUrl: '/Views/Home/Cart.html',
                    controller: 'IndexController'
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
                scope: { name: '=', src: '=', album: '=', date: '=', description: '=', preview: '=', remove: '=', index: '=', photoid: '=', ismaxsize: '=', photo: '=', incart: '=', deletefromcart: '=', addtocart: '=', isauthenticated:'=' },
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
})
.directive('scrollOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, $elm) {
            $elm.on('click', function () {
                $("body").animate({ scrollTop: $elm.offset().top }, "slow");
            });
        }
    }
})
    ;
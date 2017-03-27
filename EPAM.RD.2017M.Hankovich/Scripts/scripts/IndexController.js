angular.module('books', ['ngRoute'])
    .controller('IndexController', [
        '$scope', 'dataService', '$http', function ($scope, dataService, $http) {

            $scope.addImg = function (name, src, album, description) {
                dataService.addImg(name, src, album, description);
            }

            dataService.getAll().then(function (response) {
                $scope.albums = response.data;
            });

            $scope.descrEditMode = false;

            $scope.filemode = true;

            $scope.setFilemode = function (value) {
                if ($scope.filemode != value) {
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
                //dataService.remove(index, albumName);
                for (var i = 0; i < $scope.albums.length; i++) {
                    if ($scope.albums[i].albumName === albumName) {
                        $scope.albums[i].photos.splice(index, 1);
                    }
                }

                //
                var request = {
                    method: 'POST',
                    url: '/Home/RemoveImg',
                    data: { albumname: albumName, photoid: photoId }
                };

                $http(request)
                    .then(function (response) {
                        //alert('success');
                    },
                        function (response) {
                            //alert('fail');
                        });
                //
            }

            $scope.add = function (name, src, album) {
                if (!dataService.add(name, src, album))
                    alert("Name, src and album is required!");
            }

            $scope.user = {
                name: "",
                src: "",
                album: "",
                file: "",
                descripton: ""
            };

            $scope.newDescr = $scope.descr;
        }
    ])
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
                /*if (name !== "" && src !== "" && album !== "") {
                    var needSomeNewAlbum = true;
                    for (var i = 0; i < albums.length; i++) {
                        if (albums[i].albumName === album) {
                            albums[i].photos.push({ name, src });
                            needSomeNewAlbum = false;
                        }
                    }

                    if (needSomeNewAlbum) {
                        albums.push({ albumName: album, photos: [{ name: name, src: src }] });
                    }
                    return true;
                } else {
                    return false;
                }*/
            };

            function remove(index, albumName) {
                for (var i = 0; i < albums.length; i++) {
                    if (albums[i].albumName === albumName) {
                        albums[i].photos.splice(index, 1);
                    }
                }
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
    .config([
        '$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
            $routeProvider
                .when('/AngularRoute/', {
                    templateUrl: '/',
                    controller: 'IndexController'
                })
                .when('/AngularRoute/Index/', {
                    templateUrl: '/Views/Home/Index.html',
                    controller: 'IndexController'
                })
                .when('/AngularRoute/Temp/', {
                    templateUrl: '/Views/Home/View.html',
                    controller: 'IndexController'
                })
                .when('/AngularRoute/Edit/', {
                    templateUrl: '/Views/Home/Edit.html',
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
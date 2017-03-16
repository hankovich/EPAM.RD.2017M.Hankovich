angular.module('books', ['ngRoute'])
    .controller('IndexController', ['$scope', 'dataService', '$http', function ($scope, dataService, $http) {

        $scope.albums = dataService.getAll();

        $scope.remove = function(index, albumName){
            dataService.remove(index, albumName);
        }

        $scope.add = function(name, src, album)
        {
            if (!dataService.add(name, src, album))
                alert("Name, src and album is required!");
        }

        $scope.user = {
            name: "",
            src: "",
            album: ""
        };
    }])
.service('dataService', function () {
    var albums = [
            {
                albumName: "First",
                photos: [
                {
                    name: "1984",
                    src: "http://www.livelib.ru/reader/jennlawer/o/q2vh8epd/o-o.jpeg"
                },
                {
                    name: "Holy Bible",
                    src: "https://pbs.twimg.com/profile_images/597441961814032384/x6jCddhT.jpg"
                }
                ]
            },
            {
                albumName: "Second",
                photos: [
                {
                    name: "Harry Potter",
                    src: "https://i.ytimg.com/vi/40egrwx44vw/maxresdefault.jpg"
                },
                {
                    name: "TOUNIEJADTSYI",
                    src: "http://www.nndb.com/people/022/000098725/alexander-lukashenko-1.jpg"
                }
                ]
            }
    ];

    function getAll() {
        return albums;
    }

    function add(name, src, album) {
        if (name !== "" && src !== "" && album !== "") {
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
        }
    };

    function remove(index, albumName) {
        for (var i = 0; i < albums.length; i++) {
            if (albums[i].albumName === albumName) {
                albums[i].photos.splice(index, 1);
            }
        }
    };

    return {
        getAll: getAll,
        add: add,
        remove: remove
    }
})

.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
    $routeProvider
    .when('/AngularRoute/',{
        templateUrl: '/',
        controller: 'IndexController'
    })
    .when('/Index/', {
        templateUrl: '/Views/Home/Index.html',
        controller: 'IndexController'
    })
    .when('/Temp/', {
        templateUrl: '/Views/Home/View.html',
        controller: 'IndexController'
    })
    .otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
}])
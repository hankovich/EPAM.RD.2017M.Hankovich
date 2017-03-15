angular.module('books', [])
    .controller('IndexController', ['$scope', '$http', function ($scope, $http) {
        //jojo
        $scope.albumns = [
            {
                albumnName: "First",
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
                albumnName: "Second",
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

        $scope.remove = function(index, albumnName){
            for (var i = 0; i < $scope.albumns.length; i++) {
                if ($scope.albumns[i].albumnName === albumnName) {
                    $scope.albumns[i].photos.splice(index, 1);
                }
            }
        }

        $scope.add = function(name, src, albumn)
        {
            if (name !== "" && src !== "" && albumn !== "") {
                var needSomeNewAlbumns = true;
                for (var i = 0; i < $scope.albumns.length; i++) {
                    if ($scope.albumns[i].albumnName === albumn) {
                        $scope.albumns[i].photos.push({ name, src });
                        needSomeNewAlbumns = false;
                    }
                }

                if (needSomeNewAlbumns) {
                    $scope.albumns.push({ albumnName: albumn, photos: [{name: name, src: src}]});
                }
            } else
                alert("name and src are required!");
        }

        $scope.user = {
            name: "",
            src: "",
            albumn: ""
        };
}]);
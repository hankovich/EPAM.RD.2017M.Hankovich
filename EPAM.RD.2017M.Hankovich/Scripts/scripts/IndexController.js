angular.module('books', [])
    .controller('IndexController', ['$scope', '$http', function ($scope, $http) {
        $scope.books = [
            {
                name: "1984",
                src: "http://www.livelib.ru/reader/jennlawer/o/q2vh8epd/o-o.jpeg",
                albumnName: '1' 
            },
            {
                name: "Holy Bible",
                src: "https://pbs.twimg.com/profile_images/597441961814032384/x6jCddhT.jpg"
            },
            {
                name: "Harry Potter",
                src: "https://i.ytimg.com/vi/40egrwx44vw/maxresdefault.jpg"
            },
            {
                name: "TOUNIEJADTSYI",
                src: "http://www.nndb.com/people/022/000098725/alexander-lukashenko-1.jpg"
            }
        ];

        $scope.remove = function(index){
            $scope.books.splice(index, 1);
        }

        $scope.add = function(name, src)
        {
            if (name != "" && src != "")
                $scope.books.push({ name, src });
        }

        $scope.user = {
            name: "",
            src: ""
        };
}]);
var gmap = {};

gmap.helper = {
    //构造markers
    makeMarkers: function (items) {
        markers = [];

        $.each (items, function(idx, data){
            var latLng = new google.maps.LatLng(data.latitude, data.longitude);
            var marker = new google.maps.Marker({'position': latLng, draggable: true, id: data.id});
            markers.push(marker);
        });

        return markers;
    },

    //构造cluster样式集
    makeClusterStyles: function () {
        return [{
            url: '/static/img/map/cluster/m1.png',
            height: 53,
            width: 53,
            textColor: '#ffffff'
          }, {
            url: '/static/img/map/cluster/m2.png',
            height: 56,
            width: 56,
            textColor: '#ffffff'
          }, {
            url: '/static/img/map/cluster/m3.png',
            height: 66,
            width: 66,
            textColor: '#ffffff'
          },
          {
            url: '/static/img/map/cluster/m4.png',
            height: 78,
            width: 78,
            textColor: '#ffffff'
          },
          {
            url: '/static/img/map/cluster/m5.png',
            height: 90,
            width: 90,
            textColor: '#ffffffs'
          }
        ];
    }
};


gmap.$ = function (map) {
    var plugins = {};

    //搜索MA中的城市或地址
    plugins.searchAddress = function (address) {
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({address: address+' MA USA'}, function(results, status) {
            if(status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
            }
        });

        return this;
    };

    ////集中显示区域处理
    plugins.fitBounds = function(positions) {
        var bounds = new google.maps.LatLngBounds();

        for(var position in positions) {
            bounds.extend(position);
        }

        map.fitBounds(bounds);

        return this;
    };

    //构造边界
    plugins.makePolygon = function(coordinates) {
        var encodedpoints = [];

        $.each(coordinates, function(idx, item){
            encodedpoints.push(
                new google.maps.LatLng(item[1], item[0])
            );
        });

        var polyOptions = {
            path: encodedpoints,
            strokeColor: '#99bd2a',
            strokeOpacity: 0.9,
            strokeWeight: 2,
            fillColor: '#99bd2a',
            fillOpacity: 0.3
        };

        var it = new google.maps.Polygon(polyOptions);
        it.setMap(map);

        return this;
    };

    return plugins;
};







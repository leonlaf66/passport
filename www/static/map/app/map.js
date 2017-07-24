define('vc-map', {
    template: "#template-map",
    data: function () {
        return {
            instance: null,
            cluster: null,
            markers: [],
            mapedMarkers: {},
            propTypeNames: {
                '2': 'Single Family',
                '3': 'Multi Family',
                '4': 'Condominium',
                '5': 'Commercial',
                '6': 'Business Opportunity',
                '7': 'Land' 
            },
            infoWindow: null
        };
    },
    mounted: function () {
        var that = this;

        this.create();
        this.search('BOST');

        app.eventHub.$on('items:changed', function (results) {
            if (that.instance) {
                that.instance.setZoom(13);
            }

            // 清除边界选区
            gmap.$(that.instance).clearPolygon();
            
            that.setMarkers(results.items);

            if (results.city) {
                that.search(results.city);
            } else {
                var positions = that.markers.map(function (marker) {
                    // return marker.position;
                    return marker.latlng;
                });

                gmap.$(that.instance).fitBounds(positions);
            }

            if (results.cityPolygons.length > 0) {
                that.makePolygon(results.cityPolygons);
            }

            app.eventHub.$emit('loading:hide');
        });

        $('#map').on('click', '.gmap-html-marker', function (event) {
            var mlsId = $(this).data('marker_id');
            that.popupDetailWindow(mlsId);
            return true;
        });
    },
    methods: {
        create: function () {
            this.instance = new google.maps.Map(this.$el, {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT
                }
            });
            var transitLayer = new google.maps.TransitLayer();
            transitLayer.setMap(this.instance);

            var mapStyles = [
                {
                  featureType: 'transit',
                  elementType: 'geometry',
                  stylers: [{weight: '5px'}]
                }
            ];

            this.instance.setOptions({styles: mapStyles});

            return this.instance;
        },
        search: function (address) {
            gmap.$(this.instance).searchAddress(address);
        },
        setMarkers: function (items) { ////https://github.com/googlemaps/js-marker-clusterer
            var that = this;
            var markers = [];
            var itemParts;

            // 清除markers
            for (var i = 0; i < this.markers.length; i++ ) {
                this.markers[i].setMap(null);
            }
            this.markers.length = 0;

            // 清除clusters
            if (this.cluster) {
                this.cluster.clearMarkers();
            }

            // 构造clusters
            this.cluster = new MarkerClusterer(this.instance, [], {
                gridSize: 50,
                maxZoom: 25,
                imagePath: '/static/img/map/cluster/m',
                styles: gmap.helper.makeClusterStyles(),
                minimumClusterSize:3,
                averageCenter: true,
            });

            // 构造markers
            this.mapedMarkers = {};
            markers = items.map(function (itemStr) {
                itemParts = itemStr.split('|');
                return {
                    id: itemParts[0],
                    latitude: itemParts[1],
                    longitude: itemParts[2],
                    list_price: that.decodePirce(itemParts[3]),
                    prop_type_name: that.decodePropType(itemParts[4])
                };
            });

            this.markers = gmap.helper.makeMarkers(markers, this.instance, function (marker) {
                that.cluster.addMarker(marker);
                // 映射到mapedMarkers
                that.mapedMarkers[marker.args.marker_id] = marker;
            });

            return this.cluster;
        },
        updateMarkders: function (markers) {
            this.markers = gmap.helper.makeMarkers(markers);
        },
        makePolygon: function (polygonBlocks) {
            var gmapUtil = gmap.$(this.instance);
            for (var i = 0; i < polygonBlocks.length; i ++) {
                gmapUtil.makePolygon(polygonBlocks[i]);
            }
        },
        popupDetailWindow: function (mlsId) {
            var marker = this.mapedMarkers[mlsId];

            if (! this.infoWindow) {
                this.infoWindow = new google.maps.InfoWindow({
                    content: null,
                    pixelOffset: new google.maps.Size(0, -34)
                });

                google.maps.event.addListener(this.infoWindow, 'domready', function(){
                    window.houseDetail.createVue(this.anchor.args.marker_id);
                });
            }

            this.infoWindow.setContent('<div id="house-detail"></div>');
            this.infoWindow.open(this.instance, marker);
        },
        onMarkerClick: function (callable) {
            $.each(this.markers, function (idx, marker) {
                google.maps.event.addListener(marker, 'click', function() {  
                    callable(marker)
                });
            });
        },
        decodePirce: function (wprice) {
            return new Number(parseFloat(wprice) * 10000).toLocaleString();
        },
        decodePropType: function (id) {
            return this.propTypeNames[id];
        }
    }
});

var eventHub = new Vue({});
var components = {};

components.elGmap = {
    template: "#template-gmap",
    data: {
        instance: null,
        cluster: null,
        markers: []
    },
    mounted: function () {
        var that = this;

        this.create();
        this.search('MA');

        eventHub.$on('items:changed', function (items) {
            that.setMarkers(items);
        });
    },
    methods: {
        create: function () {
            this.instance = new google.maps.Map(this.$el, {
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                }
            });
            return this.instance;
        },
        search: function (address) {
            gmap.$(this.instance).searchAddress(address);
        },
        setMarkers: function (markers) { ////https://github.com/googlemaps/js-marker-clusterer
            this.markers = gmap.helper.makeMarkers(markers);

            this.cluster = new MarkerClusterer(this.instance, this.markers, {
                gridSize: 50,
                maxZoom: 20,
                imagePath: '/static/img/map/cluster/m',
                styles: gmap.helper.makeClusterStyles(),
                averageCenter: true,
                minimumClusterSize: 3
            });

            return this.cluster;
        },
        updateMarkders: function (markers) {
            this.markers = gmap.helper.makeMarkers(markers);
        },
        makePolygon: function (polygonBlocks) {
            var that = this;
            $.each(polygonBlocks, function(idx, polygons){
                gmap.$(that.instance).makePolygon(polygons);
            });
        },
        onMarkerClick: function (callable) {
            $.each(this.markers, function (idx, marker) {
                google.maps.event.addListener(marker, 'click', function() {  
                    callable(marker)
                });
            });
        }
    }
};

components.elNav = {
    template: "#template-nav"
};

components.elPanel = {
    template: "#template-panel",
    mounted: function () {
        this.search();
    },
    methods: {
        search: function () {
            var that = this;
            $.get('/map/house/purchase/search/', function (items) {
                that.onSearched(items);
            });
        },
        onSearched: function (items) {
            eventHub.$emit('items:changed', items);
        }
    }
};

new Vue({
    el: "#map-app",
    components: components
});
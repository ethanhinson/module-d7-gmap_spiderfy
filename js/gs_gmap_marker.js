/**
 * @file
 * GMap Markers
 * GMap API version -- No manager
 */

/*global Drupal, GMarker */

// Replace to override marker creation
Drupal.gmap.factory.marker = function (opts) {
    return new google.maps.Marker(opts);
};

Drupal.gmap.addHandler('gmap', function (elem) {
    var obj = this;

    obj.bind('init', function() {
        if (obj.vars.behavior.spiderfy) {
            var omsOptions = {keepSpiderfied : true};
            Drupal.gmap.oms = new OverlappingMarkerSpiderfier(obj.map, omsOptions);
            Drupal.gmap.oms.addListener('click', function(m, event) {
                obj.change('clickmarker', -1, m.gmapmarker);
            });
            Drupal.gmap.oms.addListener('unspiderfy', function(markers) {
                var iw = Drupal.gmap.getInfoWindow();
                if(iw) {
                    iw.close();
                }
            });
        }
    });

    obj.bind('addmarker', function (marker) {
        if (!obj.map.markers) obj.map.markers = new Array();
        marker.marker.setMap(obj.map);
        obj.map.markers.push(marker.marker);
        var m = marker.marker;
        // Add the full gmap marker object o pass around
        m.gmapmarker = marker;
        // Clear all standard eventListeners as we register with OMS
        google.maps.event.clearInstanceListeners(m, 'click');
        Drupal.gmap.oms.addMarker(m);
    });

    obj.bind('delmarker', function (marker) {
        marker.marker.setMap(null);
    });

    obj.bind('clearmarkers', function () {
        // @@@ Maybe don't nuke ALL overlays?
        if (obj.map.markers) {
            for (var i = 0; i < obj.map.markers.length; i++) {
                obj.map.markers[i].setMap(null);
            }
        }
    });
});
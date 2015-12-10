'use strict';

/**
 * @ngdoc constant
 * @description
 * Application Constants
 */
angular.module('museumOfFlightApp')

	//TODO: Move most of these to an ApplicationPropertiesService
	.constant('DOMAIN_URL', 'http://mof.exhibits.winonearth.com/')

	.constant('APP_DEFAULT_ROUTE_PATH', '/touch/photography')
	.constant('VIEWS_DIR', 'views/')
	.constant('DEBUG_MODE', false)
	.constant('LINK_WINDOWS', true)

	.constant('BASE_TOUCH_URL', '/touch/')
	.constant('BASE_TOUCH_URL_PATTERN', /^\/touch/ )

	.constant('BASE_VIEWER_URL', '/viewer/')
	.constant('BASE_VIEWER_URL_PATTERN', /^\/viewer/ )

	.constant('BASE_TOUCH_BLUE_URL', 'images/land_shallow_topo_2048.jpg')

	.constant('BASE_PHOTOGRAPHY_ASSET_PATH', 'resources/photography/')

	// Service/Resource URLS
	.constant('SERVICES_CACHE_DURATION',      0)
	.constant('SERVICES_BASE_PATH',           'resources/')
	.constant('SERVICES_MENU_ITEMS',          'menu/menuitems.json')
	.constant('SERVICES_FLYOVERS',            'flyover/flyover.json')
	.constant('SERVICES_FLYOVERS_TLE',        'flyover/:tlePath/:flyoverId.tle.json')
	.constant('SERVICES_FLYOVERS_MOVIES',     'http://mof.exhibits.winonearth.com/movies/:flyoverId.:type')
	.constant('SERVICES_PHOTOGRAPHY_GALLERY', 'photography/gallery.json')
	.constant('SERVICES_PHOTOGRAPHY_ALBUM',   'photography/:album/album.json')

	.constant('CESIUM_BING_API_KEY',          'AqehBS3lTILMMhMB5qwom2JiB70CqXXrbTQ8LYujZ1e4Iz1lhYyv_A_r6PiOKRtg')

	.constant('GEO_SERVER_MOF_CONF', {
		url: 'http://mof.exhibits.winonearth.com/geoserver/SeattleMoF/wms',
		//url: 'https://mof.exhibits.winonearth.com/geoserver/SeattleMoF/wms',
		layer: {
			day:    'SeattleMoF:BlueMarble',
			night:  'SeattleMoF:BlackMarble'
		}
	})
;

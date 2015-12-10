# Flyovers Documentation #

Real-Time configuration

	{
		"durationDefault": "120",
		"cacheDuration": 64800,
		"imagePath": "images",
		"tlePath": "tles",
		"issIcon": "ISSIcon.png",
		"flyoverDefault": "issNow",

		"flyovers": [

			{
				"id": "issNow",
				"title": "I.S.S. Now",
				"description": "Real-time view of the International Space Station",
				"enabled": true,
				"type": "realTime",
				"mediaType": "cesium",
				"coverType": "jpg",
				"startTime": null,
				"endTime": null
			},
			{
				"id": "aurora",
				"title": "Northern Auroras",
				"description": "",
				"enabled": true,
				"type": "static",
				"mediaType": "mp4",
				"coverType": "png",
				"startTime": "2015-01-30T07:55:54+0000",
				"endTime": "2015-01-30T07:56:14+0000",
				"mediaWidth": 2886,
				"mediaHeight": 1920,
				"hasNight":false
			},
			{
				"id": "miami",
				"title": "Miami, Cuba and Bahamas",
				"description": "",
				"enabled": true,
				"type": "static",
				"mediaType": "mp4",
				"coverType": "png",
				"startTime": "2015-04-02T10:11:19+0000",
				"endTime": "2015-04-02T10:11:39+0000",
				"mediaWidth": 2886,
				"mediaHeight": 1920,
				"hasNight":false
			},
			{
				"id": "newYork",
				"title": "DC to New York City",
				"description": "",
				"enabled": true,
				"type": "static",
				"mediaType": "mp4",
				"coverType": "png",
				"startTime": "2015-01-11T09:51:48+0000",
				"endTime": "2015-01-11T09:52:08+0000",
				"mediaWidth": 2886,
				"mediaHeight": 1920,
				"hasNight":false
			},
			{
				"id": "tibet",
				"title": "Tibet",
				"description": "",
				"enabled": true,
				"type": "static",
				"mediaType": "mp4",
				"coverType": "png",
				"startTime": "2015-03-08T08:43:22+0000",
				"endTime": "2015-03-08T08:43:42+0000",
				"mediaWidth": 2886,
				"mediaHeight": 1920,
				"hasNight":false
			},
			{
				"id": "washington",
				"title": "Washington State",
				"description": "",
				"enabled": true,
				"type": "static",
				"mediaType": "mp4",
				"coverType": "png",
				"startTime": "2015-03-08T19:19:57+0000",
				"endTime": "2015-03-08T19:20:17+0000",
				"mediaWidth": 2886,
				"mediaHeight": 1920,
				"hasNight":false
			}
		]
	}

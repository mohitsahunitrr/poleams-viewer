var apiUrl_config = {
	"poleams.inspectools.net": "https://servicesdev.inspectools.net/poleams/",
	"poleamsdemo.inspectools.net": "https://servicesdev.inspectools.net/poleams/",
	"maps.inspectools.net":"https://servicesdev.inspectools.net/poleams/",
	"precisionanalytics.precisionhawk.com":"https://services.inspectools.net/poleams/v0.0/",
	"precisionanalytics.demo.precisionhawk.com": "https://servicesdev.inspectools.net/poleams/"
}

var auth0_config = {
	"precisionanalytics.precisionhawk.com": {
		"tenant":  "precisionanalytics-prod.auth0.com",
		"clientID": "uvI50Oy379yqO5B3K26znlWjBM2ZMruw",
		"resource": "https://paservicesprod.inspectools.net/",
		"callbackURL": "https://precisionanalytics.precisionhawk.com/"
	},
	"poleamsdemo.inspectools.net": {
		"tenant":  "precisionanalytics-dev.auth0.com",
		"clientID": "g9EIvy49DJcn8rOAqDY75qRm5yBi94IF",
		"resource": "https://paservicesdev.inspectools.net/",
		"callbackURL": "https://poleamsdemo.inspectools.net/"
	},
	"precisionanalytics.demo.precisionhawk.com": {
		"tenant":  "precisionanalytics-dev.auth0.com",
		"clientID": "g9EIvy49DJcn8rOAqDY75qRm5yBi94IF",
		"resource": "https://paservicesdev.inspectools.net/",
		"callbackURL": "https://precisionanalytics.demo.precisionhawk.com/"
	}
}
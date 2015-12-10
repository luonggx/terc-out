# Seattle Museum of Flight #

## Tech Stack ##
* AngularJS
* Yeoman
* Bootstrap Compass
* NodeJS
* CesiumJS
* GeoServer (java stand-alone server)

## Developer Setup ##
I highly recommend you use WebStorm for development on this project, but it's not required.

**Requirements**

* NodeJS (npm) - install via [brew](http://brew.sh/) or [NodeJS.org](http://nodejs.org/download/)
* GeoServer - [GeoServer](http://geoserver.org/download/) (not yet required, but will be)
* Compass - [installation info](http://compass-style.org/install/) It will require Ruby I recommend using [RVM](https://rvm.io/) to install and manage Ruby 
* Chrome - for inspecting DOM in Angular
* Git-Flow - (SourceTree will provide the Git-Flow workflow, WebStorm can handle it too)

After you checkout the project onto your local machine your going to need to install some Node Packages.
``` 
# Install Brew (if not already installed)
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Components required and managed via Brew 
brew install npm Caskroom/cask/java geoserver

gem install compass

npm install -g yo generator-angular bower grunt grunt-cli
```
Install web-app dependencies

npm install;
#dependency installation; !!! require updating of the dependency script; script currently not 
getting all required or updated on last attempt of fresh installing them before sending off; currently using
existing dependencies; when updating or fresh install, keep a back up just in case
```

When Yeoman was installed (yo), both Grunt and Bower should have been installed as well.  You will absolutely need them functioning and if they are you should see them as command line options.  If for some reason you do not see them as options on the command line than you're going to need to install them manually using the following command

```

I also highly recommend you run the following 

This project uses grunt for a build manager:  The tasks you should be most familiar with are
```
#!bash
cd path_to_your_project_dir/web-app; 

grunt clean
#clear temp and the distribution directories

grunt debug
#run a live reloading version of the application that will be accessible via http://mof.exhibits.winonearth.com

grunt build
#builds a production ready distribution in the 'dist' directory, but does not minify the javascript files or auto-increment the build number.

grunt package;
#same as 'grunt build', but will auto-increment the build number, minify the javascript files and create a zip file of the application in the 'package' directory
```
geoserver path_to_your_geoserver_dir/geoserver;
#Run geoserver
```

## Working on the project ##
* Use tabs (not spaces) you can adjust your IDE accordingly
* use yeoman to generate your services, factories, controllers, views and directives, ex: yo angular:directive MyDirective or yo angular:service MyService (controllers will actually generate a view for you at the same time)
```
Running application on Chrome Extension

# chrome://extenions
# load unpacked extensions and select the /path_to_your_project_dir/web-app/dist directory (after having grunt build & package the modified/updated application for changes)
```
Packing Chrome Extensions (Chrome packing of the /dist directory to a CRX file, a Chrome App)

#This creates the Chrome App that is allowing Chrome Apps to register it and run it on Windows.  This requires the Chrome pem key, which it creates one for you on first packaging.  Keep this key within the web-application folder.
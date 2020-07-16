# Racespot Media Website

This project was developed in conjunction with the [RaceSpot Livery API](https://github.com/kanki6315/racespot-livery-api) and is intended to be deployed and used together with the API.
This repo contains an Angular project generated via CLI that is built as a static site and deployed and served through AWS S3 and CloudFront.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build & Deploy
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. The produced files can then be moved to 
S3 to be served. Setup S3 to support static file hosting and ensure public access is defaulted, configure Route53/Cloudfront if desired as well and your UI will be available! If you choose
to use CloudFront, you will want to setup a custom error response for a 403 to redirect back to `index.html` if a user hits refresh when the url has had anything appended to it.

## Maintenance Page
There is a maintenance page available in the repo for if you need to take down the website for any reason. Simply change your CloudFront and S3 settings to point to this file instead of index.html

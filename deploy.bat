@echo off
echo Building the project...
npm run build

echo Deploying to GitHub Pages...
npm run deploy

echo Deployment complete! Your site should be available at: https://pomidorkaeg.github.io/sdf/
pause 
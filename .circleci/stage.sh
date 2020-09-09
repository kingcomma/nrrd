#!/bin/bash
cf api https://api.fr.cloud.gov
cf auth "$STAGING_CF_USERNAME" "$STAGING_CF_PASSWORD"
cf target -o "$STAGING_CF_ORG" -s "$STAGING_CF_SPACE"
BRANCH=`git rev-parse --abbrev-ref HEAD`

git checkout staging
git fetch
git pull origin staging
git merge $BRANCH 
CONFLICT=$?
if [ $CONFLICT -gt 0 ]
then 
    echo "Conflict occurred aborting merge - Did you merge staging with your branch before pushing?"
    git merge --abort
    exit $CONFLICT
else 
    echo "cf push preview-nrrd -f ./manifest.staging.yml "
    cf push preview-nrrd -f ./manifest.staging.yml   
    echo "$BRANCH merge is successful commiting change: Changes can be viewed at https://preview-nrrd.app.cloud.gov"
    

fi

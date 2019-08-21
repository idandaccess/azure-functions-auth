#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# -e: immediately exit if any command has a non-zero exit status
# -o: prevents errors in a pipeline from being masked
# IFS new value is less likely to cause confusing bugs when looping arrays or arguments (e.g. $@)

usage() { echo "Usage: $0 -i <subscriptionId> -g <resourceGroupName> -l <resourceGroupLocation>" 1>&2; exit 1; }

# Check if parameters are defined as env vars
declare subscriptionId="${AZURE_SUBSCRIPTION_ID:-}"
declare resourceGroupName="${AZURE_RESOURCEGROUP_NAME:-}"
declare resourceGroupLocation="${AZURE_RESOURCEGROUP_LOCATION:-}"

# Initialize parameters specified from command line
while getopts ":i:g:n:l:" arg; do
	case "${arg}" in
		i)
			subscriptionId=${OPTARG}
			;;
		g)
			resourceGroupName=${OPTARG}
			;;
		l)
			resourceGroupLocation=${OPTARG}
			;;
		esac
done
shift $((OPTIND-1))

#Prompt for parameters is some required parameters are missing
if [[ -z "$subscriptionId" ]]; then
	echo "Your subscription ID can be looked up with the CLI using: az account show --out json "
	echo "Enter your subscription ID:"
	read subscriptionId
	[[ "${subscriptionId:?}" ]]
fi

if [[ -z "$resourceGroupName" ]]; then
	echo "This script will look for an existing resource group, otherwise a new one will be created "
	echo "You can create new resource groups with the CLI using: az group create "
	echo "Enter a resource group name"
	read resourceGroupName
	[[ "${resourceGroupName:?}" ]]
fi

if [[ -z "$resourceGroupLocation" ]]; then
	echo "If creating a *new* resource group, you need to set a location "
	echo "You can lookup locations with the CLI using: az account list-locations "
	
	echo "Enter resource group location:"
	read resourceGroupLocation
fi

if [ -z "$subscriptionId" ] || [ -z "$resourceGroupName" ] || [ -z "$resourceGroupLocation" ]; then
	echo "Either one of subscriptionId, resourceGroupName, deploymentName is empty"
	usage
fi

#login to azure using your credentials
az account show 1> /dev/null

if [ $? != 0 ];
then
	az login
fi

#set the default subscription id
az account set --subscription $subscriptionId

# Install prod deps
echo "Installing exact production dependencies (so no dev dependencies) ..."
( 
  npm ci --only=prod
)

# Deploy
echo "Starting Function App deployment with core tools ..."

set +e

# Try to deploy to Function App
#   1> /dev/null is to prevent the function key being logged
npx azure-functions-core-tools azure functionapp publish $resourceGroupName --resource-group $resourceGroupName 1> /dev/null

if [ $? != 0 ]; then
	echo "New resource group not yet available. Waiting and retrying.."
	set -e
  sleep 60
	(
		set -x
    #   1> /dev/null is to prevent the function key being logged
		npx azure-functions-core-tools azure functionapp publish $resourceGroupName --resource-group $resourceGroupName 1> /dev/null
	)
	else
	echo "Resource group seems to have already existed"
fi



# (
#   #echo "Ignored files:"
#   #node_modules/.bin/func azure functionapp publish $resourceGroupName --list-ignored-files
  
#   set +e
#   if [ (npx azure-functions-core-tools azure functionapp publish $resourceGroupName --resource-group $resourceGroupName) ];
#   then
#     set -e
#     echo "Resource group seems to have already existed"
#     sleep 1m
#     set -e
#   else
#     echo "New resource group not yet available. Waiting and retrying.."
    
#     npx azure-functions-core-tools azure functionapp publish $resourceGroupName --resource-group $resourceGroupName
#   fi
# )

if [ $?  == 0 ];
then
	echo "Function App has been successfully deployed"
fi

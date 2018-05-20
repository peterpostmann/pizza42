# Pizza42

This sample demonstrate how to add authentication to a Vue.js application with Auth0 and make secure calls to an API.

Demo: https://pizza42.octocraft.org/

* Frontend: Vue.js, Vuex, Bootstrap
* Backend: Node.js, Express
* Deployment: AWS Lambda, API Gateway, S3
* Infra: Terraform
* Auth: Auth0

## Setup

### Auth0 Setup

1. Sign up https://auth0.com/signup
2. Create an Application https://auth0.com/docs/applications#how-to-configure-an-application
2.1 Add `http://localhost:8080/` to allowed URLs
2.2 Add Facebook as connection
3. Create an API https://auth0.com/docs/apis#how-to-configure-an-api-in-auth0
4. Create `backend/config/auth0-variables.json`
    * clientId: from Auth0/Applications/YourApplication/Settings/Client ID
    * domain: from Auth0/Applications/YourApplication/Settings/Domain
    * audience: from Auth0/APIS/YourAPU/Settings/Identifier
    * namespace: custom (must be url, https://auth0.com/docs/api-auth/tutorials/adoption/scope-custom-claims#custom-claims)
5. Create Rules from `infra/auth0/rules`
    *  link_accounts.js - Link Accounts with Same Email Address while Merging Metadata
    * add_email_and_verified_status.js - Add email and email verifiy status to the id_token and the verified status to the access_token. Update {NAMESPACE} accordingly.

### Local Setup

If you are on linux/x64 you may run `./scripts/install_local.sh`

#### DynamoDB Local
```
cd./infra/local/ddb_local
npm install
npm run-script start
```
This will create `./infra/local/ddb_local/dynamodblocal-bin/shared-local-instance.db` which contains the data you store in the database.

#### DynamoDB Proxy
```
cd./infra/local/ddb_proxy
npm install
npm run-script start
```

The table is created using terraform which currenlty has a bug (https://github.com/terraform-providers/terraform-provider-aws/issues/1059) when working with DynamoDb localy, therefore a proxy is used.

#### Terraform
Get Terraform https://www.terraform.io/downloads.html

```
cd ./infra/local
terraform init
terraform apply -input=false -auto-approve
```

After terraform finished, you can kill the proxy.

#### Backend
```
cd ./backend
npm install
```

#### Frontend
```
cd ./frontend
npm install
```

### Run locally

If you are on linux/x64 you may run `./scripts/run_local.sh`

#### DynamoDB Local
```
cd ./infra/local/ddb_local
npm run-script start
```

#### Backend
```
cd ./backend
npm run-script start
```

#### Frontend
```
cd ./frontend
npm run-script start
```

### Remote Setup

If you are on linux/x64 you may run `./scripts/install_remote.sh`

#### Infra
1. Sign up for AWS https://portal.aws.amazon.com/billing/signup
2. Configure your AWS credentials https://www.terraform.io/docs/providers/aws/

```
cd ./infra/remote
terraform init
terraform apply -input=false -auto-approve
```

This will create `./infra/remote/terraform.tfstate` which is needed to update/destroy the ressources. You may want to backup this file or store it remotely (e.g. in S3: https://www.terraform.io/docs/backends/types/s3.html).

#### Backend
```
npm run-script deploy
```

#### Frontend
```
npm run-script build
npm run-script deploy
```

## Configuration Files

``./backend/config/auth0-variables.json`` 
* As described in "Auth0 Setup"

``./infra/local/local.auto.tfvars`` 
* api_port: Local backend port
* ddb_port: DynamoDb local port
* ddb_proxy_port: DynamoDb proxy port


``./infra/local/config.auto.tfvars``,  ``./infra/remote/config.auto.tfvars`` 
* region: AWS region 
* name: Prefix for AWS ressources

## Based on
* https://github.com/auth0-samples/auth0-vue-samples
* https://github.com/matheusazzi/shop-vue

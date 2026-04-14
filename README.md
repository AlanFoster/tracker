# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

- Ruby version

- System dependencies

- Configuration

- Database creation

- Database initialization

- How to run the test suite

- Services (job queues, cache servers, search engines, etc.)

- Deployment instructions

- ...

### Docker setup

First read the steps within `.env.example`. Then run docker:

```
docker compose build
docker compose build up
```

### New Remote Environments

Setup infra:

```
tofu -chdir=infra/terraform/environments/production init
tofu -chdir=infra/terraform/environments/production plan -out plan
tofu -chdir=infra/terraform/environments/production apply plan
```

Remote setup:

```
kamal server bootstrap
kamal build create
kamal deploy
```

Database:

```
kamal accessory boot db
kamal accessory details db
```

Deploy:

```
# Latest commit
tofu -chdir=infra/terraform/environments/production init; kamal eploy

# Unstaged changes
tofu -chdir=infra/terraform/environments/production init; UILD_WITH_HEAD=true kamal deploy
```

Health commands:

```
kamal app exec --reuse "bin/rails runner 'puts User.count'"
```

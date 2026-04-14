# Hetzner Terraform (OpenTofu)

Provisions the Hetzner Cloud infrastructure for the `tracker` app

## Prerequisites

- **Hetzner Cloud account and API token** — generate one at [cloud.hetzner.com](https://cloud.hetzner.com) -> Security -> API Tokens (Read and Write)
- **SSH key** at `~/.ssh/id_ed25519.pub` — generate with `ssh-keygen -t ed25519`
- **OpenTofu/Terraform**
- **`HCLOUD_TOKEN` environment variable** set to your API token

## Setup

```bash
export HCLOUD_TOKEN=your_token_here
cd environments/production
tofu init
tofu plan -out plan
tofu apply plan
```

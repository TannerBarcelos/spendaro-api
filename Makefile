.PHONY: setup-db

setup-db:
	pnpm db:generate-migration-dev && pnpm db:migrate && pnpm db:seed

# https://theboroer.github.io/localtunnel-www/ <- To test webhooks, we need to expose our local server to the internet
tunnel:
	npm i -g localtunnel && lt --port 8010
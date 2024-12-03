.PHONY: setup-db

setup-db:
	pnpm db:generate-migration-dev && pnpm db:migrate && pnpm db:seed

tunnel:
	ngrok http 8010
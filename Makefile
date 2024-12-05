.PHONY: setup-db

setup-db:
	pnpm db:gen-migration && pnpm db:migrate && pnpm db:seed

tunnel:
	ngrok http 8010
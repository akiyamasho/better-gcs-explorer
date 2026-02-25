.PHONY: install dev run dmg

install:
	@if [ ! -d node_modules ]; then pnpm install; fi

dev: install
	pnpm run dev

run: install
	pnpm run build
	pnpm run package
	@if [ -d "dist/mac-arm64/Better GCP.app" ]; then \
		open "dist/mac-arm64/Better GCP.app"; \
	elif [ -d "dist/mac/Better GCP.app" ]; then \
		open "dist/mac/Better GCP.app"; \
	else \
		echo "App not found in dist/mac-arm64 or dist/mac"; \
		exit 1; \
	fi

dmg: install
	pnpm run build
	pnpm run package

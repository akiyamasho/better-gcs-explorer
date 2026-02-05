.PHONY: install dev run dmg

install:
	@if [ ! -d node_modules ]; then pnpm install; fi

dev: install
	echo "There is an issue with Electron dev when testing in Silicon Mac. Please use `make run` instead."
#	env -u ELECTRON_RUN_AS_NODE pnpm run dev

run: install
	pnpm run build
	pnpm run package
	@if [ -d "dist/mac-arm64/Better GCS Explorer.app" ]; then \
		open "dist/mac-arm64/Better GCS Explorer.app"; \
	elif [ -d "dist/mac/Better GCS Explorer.app" ]; then \
		open "dist/mac/Better GCS Explorer.app"; \
	else \
		echo "App not found in dist/mac-arm64 or dist/mac"; \
		exit 1; \
	fi

dmg: install
	pnpm run build
	pnpm run package

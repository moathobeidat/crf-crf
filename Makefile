# Makefile
# Makefile for MAFUI Demo 1

MAKEFLAGS += -j2
-include .env
export

# Git variables
CURRENT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
CURRENT_PATH := $(shell pwd)
DEFAULT_BRANCH := $(shell git remote show upstream | sed -n '/HEAD branch/s/.*: //p')
AMM := ${HOME}/amm

# Node variables
NODE_ENV ?= development
PORT ?= 3000

# Git operations
.PHONY: gitRebase
gitRebase:
	git checkout $(DEFAULT_BRANCH) && \
		git pull upstream $(DEFAULT_BRANCH) && \
		git push origin $(DEFAULT_BRANCH) && \
		git checkout $(CURRENT_BRANCH) && \
		git rebase $(DEFAULT_BRANCH)
		git push --force origin $(CURRENT_BRANCH)

.PHONY: gitAmend
gitAmend:
	git add . && git commit --amend --no-edit && git push --force origin $(CURRENT_BRANCH)

.PHONY: gitPush
gitPush:
	git push origin $(CURRENT_BRANCH)

# Development operations
.PHONY: install
install:
	yarn install

.PHONY: run dev
run dev:
	yarn dev

.PHONY: build
build:
	yarn build

.PHONY: start
start:
	yarn start

.PHONY: lint
lint:
	yarn lint

.PHONY: test
test:
	yarn test

# Clean operations
.PHONY: clean
clean:
	rm -rf .next
	rm -rf node_modules/.cache

.PHONY: cleanModules
cleanModules:
	rm -rf node_modules
	yarn install

# Help
.PHONY: help
help:
	@echo "MAFUI Demo 1 Makefile"
	@echo ""
	@echo "Git Operations:"
	@echo "  make gitRebase    - Rebase current branch with default branch"
	@echo "  make gitAmend     - Amend current commit and force push"
	@echo "  make gitPush      - Push current branch to origin"
	@echo ""
	@echo "Development Operations:"
	@echo "  make install      - Install dependencies"
	@echo "  make run, dev     - Start development server"
	@echo "  make build        - Build for production"
	@echo "  make start        - Start production server"
	@echo "  make lint         - Run linter"
	@echo "  make test         - Run tests"
	@echo ""
	@echo "Clean Operations:"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make cleanModules - Remove node_modules and reinstall"
	@echo ""

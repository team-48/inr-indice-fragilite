run.reset:
	rm -rf vendor/ cache/
	composer install
	php -S localhost:8080 -t public/

run.reset:
	rm -rf vendor/
	composer install
	php -S localhost:8080 -t public public/index.php
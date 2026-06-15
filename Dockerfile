FROM php:8.4-apache

RUN apt-get update && apt-get install -y \
    curl unzip git libpng-dev libzip-dev libxml2-dev libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql zip xml \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-scripts --no-interaction

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

CMD ["sh", "-c", "php artisan config:clear && php artisan migrate --force && php artisan storage:link && apache2-foreground"]

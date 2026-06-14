FROM dunglas/frankenphp:php8.4-bookworm

# Install system dependencies and Composer
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --optimize-autoloader --no-scripts

# Install Node dependencies and build assets
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application
COPY . .

RUN npm run build

# Cache Laravel configuration
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache \
    && php artisan event:cache

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=$PORT

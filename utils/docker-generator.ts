import { parseValue } from "@/app/[locale]/calculator/utils";

export const normalizePlanForDocker = (plan: any, providerName: string) => {
    const getF = (key: string) => plan.features?.find((f: any) => f.key === key)?.value || 0;

    const nRam = parseValue(getF('memory'));
    const isMB = String(getF('memory')).toLowerCase().includes('mb');

    return {
        ...plan,
        providerName: providerName,
        ramInGb: isMB ? nRam / 1024 : nRam,
        nCpu: parseValue(getF('vcpu') || 1),
        providerId: plan.plan_id,
    };
};

export const generateDockerCompose = (plan: any, tech: string = 'nodejs') => {
    const numericRam = plan.ramInGb === 0 ? 0.5 : plan.ramInGb;
    const ramLimit = numericRam < 1 ? `${numericRam * 1024}M` : `${numericRam}G`;
    const cpuLimit = plan.nCpu?.toString() || '1';

    const logging = `
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"`;

    const templates: Record<string, string> = {
        nodejs: `services:
  app:
    image: node:20-alpine
    container_name: ${plan.providerId}-node-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    deploy:
      resources:
        limits:
          cpus: '${cpuLimit}'
          memory: ${ramLimit}${logging}`,

        wordpress: `services:
  db:
    image: mysql:8.0
    container_name: wp-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: changeme_root
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wp_user
      MYSQL_PASSWORD: changeme_password
    volumes:
      - db_data:/var/lib/mysql
    deploy:
      resources:
        limits:
          memory: ${numericRam > 1 ? '512M' : '256M'}
  
  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    container_name: wp-app
    restart: always
    ports:
      - "80:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wp_user
      WORDPRESS_DB_PASSWORD: changeme_password
      WORDPRESS_DB_NAME: wordpress
    deploy:
      resources:
        limits:
          cpus: '${cpuLimit}'
          memory: ${ramLimit}${logging}

volumes:
  db_data:`,

        python: `services:
  web:
    image: python:3.11-slim
    container_name: ${plan.providerId}-python-app
    restart: unless-stopped
    command: gunicorn --workers 3 --bind 0.0.0.0:8000 app:app
    ports:
      - "8000:8000"
    deploy:
      resources:
        limits:
          cpus: '${cpuLimit}'
          memory: ${ramLimit}${logging}`,

        laravel: `services:
  app:
    image: bitnami/laravel:latest
    container_name: ${plan.providerId}-laravel-app
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=mariadb
      - DB_USERNAME=bn_laravel
      - DB_PASSWORD=changeme_password
    depends_on:
      - mariadb
    deploy:
      resources:
        limits:
          cpus: '${cpuLimit}'
          memory: ${ramLimit}
  mariadb:
    image: bitnami/mariadb:latest
    container_name: ${plan.providerId}-mariadb
    environment:
      - MARIADB_USER=bn_laravel
      - MARIADB_PASSWORD=changeme_password
      - MARIADB_DATABASE=bitnami_laravel
    deploy:
      resources:
        limits:
          memory: 512M${logging}`,

        go: `services:
  app:
    image: golang:1.21-alpine
    container_name: ${plan.providerId}-go-app
    restart: unless-stopped
    ports:
      - "8080:8080"
    deploy:
      resources:
        limits:
          cpus: '${cpuLimit}'
          memory: ${ramLimit}${logging}`,
    };

    return templates[tech] || templates['nodejs'];
};
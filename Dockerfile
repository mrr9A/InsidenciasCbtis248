# Usa una imagen base de Node.js para compilar la aplicación
FROM node:18 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias y construir la app
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código fuente al contenedor
COPY . .

# Compila la aplicación para producción
RUN npm run build --prod

# Usa una imagen base de NGINX para servir la aplicación compilada
FROM nginx:stable-alpine

# Copia los archivos compilados desde el paso de construcción
COPY --from=build /app/dist/incidencias-cbtis248 /usr/share/nginx/html

# Copia el archivo de configuración de NGINX, si es necesario (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# Inicia el servidor NGINX
CMD ["nginx", "-g", "daemon off;"]

# Deploy del backend en Render

## Servicio

- Tipo: Web Service.
- Nombre recomendado: `polibarber-backend`.
- Root directory: `backend`.
- Build command: `npm install`.
- Start command: `npm start`.
- Health check: `/api/health`.

## Variables de entorno

```text
NODE_ENV=production
PORT=10000
MONGO_URI=<URI de MongoDB Atlas o MongoDB externo>
JWT_SECRET=<secreto largo generado por Render>
JWT_EXPIRES_IN=8h
ADMIN_USER=admin
ADMIN_PASSWORD=poli123
CLIENT_URL=<URL del frontend cuando se despliegue>
```

Render no ofrece MongoDB local persistente para este caso. Para producción se recomienda MongoDB Atlas y copiar la URI en `MONGO_URI`.

## Blueprint

El archivo `render.yaml` en la raíz permite crear el servicio desde Render Blueprints. `MONGO_URI` queda marcado como `sync: false` para cargarlo manualmente y no publicarlo en GitHub.

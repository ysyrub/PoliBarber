# Guía de ejecución paso a paso

## 1. Requisitos

Instala:

- Node.js LTS.
- MongoDB Community Server.
- Visual Studio Code.

## 2. Abrir el proyecto

```bash
code C:\proyectos\PoliBarber
```

## 3. Instalar dependencias

```bash
cd C:\proyectos\PoliBarber
npm run install:all
```

## 4. Configurar variables de entorno

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

## 5. Iniciar MongoDB local

Si MongoDB está instalado como servicio de Windows, abre Servicios y verifica que `MongoDB Server` esté iniciado.

También puedes usar:

```bash
mongod --dbpath C:\data\db
```

La API espera esta URL:

```text
mongodb://127.0.0.1:27017/polibarber
```

## 6. Cargar datos iniciales

```bash
npm run seed
```

Esto crea:

- Barberos: Carlos, Miguel y Fernando.
- Servicios: Pelo, Barba, Ceja, Bañado.
- Combos: Pelo + Barba, Pelo + Ceja, Completo sin baño, Completo con baño.

## 7. Iniciar backend

```bash
npm run server
```

Backend:

```text
http://localhost:5000
```

## 8. Iniciar frontend

En otra terminal:

```bash
npm run client
```

Frontend:

```text
http://localhost:5173
```

## 9. Iniciar todo junto

```bash
npm run dev
```

## 10. Acceder al panel admin

Ruta:

```text
http://localhost:5173/admin
```

Credenciales:

```text
Usuario: admin
Contraseña: poli123
```

## 11. Build de producción

```bash
npm run build
```

El resultado queda en:

```text
frontend\dist
```

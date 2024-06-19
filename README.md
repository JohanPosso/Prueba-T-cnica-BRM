# PRUEBA TÉCNICA BRM - BACKEND

Esta es una API para una tienda electrónica que cuenta con dos roles: cliente y administrador. Aquí puedes registrar tus datos (y también modificarlos) e iniciar sesión.

## El Administrador:

El administrador tiene los siguientes privilegios:

- Crear, leer, actualizar y eliminar productos del inventario. Cada producto tiene las siguientes especificaciones:

  - Número de lote
  - Nombre
  - Precio
  - Cantidad disponible
  - Fecha de ingreso

- Visualizar las compras realizadas por todos los usuarios. Podrá ver el cliente, la fecha, los productos (con sus cantidades) y el valor total de la compra.

## El Cliente:

El cliente puede realizar las siguientes acciones:

- Agregar, modificar y eliminar productos con sus respectivas cantidades en el carrito de compras.
- Proceder a comprar el producto.
- Visualizar el historial de todas las órdenes realizadas previamente.

## Documentación

La documentación del API está disponible:

- [Postman](https://documenter.getpostman.com/view/17608884/2s9YXe6PLs)

## Base de datos deplegada para hacer pruebas

- DB_HOST=ep-red-lab-81958600.eu-central-1.aws.neon.fl0.io
- DB_USERNAME=fl0user
- DB_PASSWORD=mhbrDJ2ATH1u
- DB=ecommerce

## Usuario de Prueba con privilegios de administrador

- Email: johan@hotmail.com
- Password: 123

## Inicia el Proyecto Localmente

Para ver el proyecto localmente, sigue estos pasos:

1. Instala las dependencias utilizando el siguiente comando:

```bash
npm install
```

2. Levanta el servidor con el siguiente comando:

```bash
npm run start
```

3. Comprueba la conexion a la base de datos
4. Realiza peticiones a los endpoints
# Prueba-T-cnica-BRM
# Prueba-T-cnica-BRM
# Prueba-T-cnica-BRM

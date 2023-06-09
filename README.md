

# Antes que nada:

1.  Clonar el repositorio desde la rama master. Si ya lo habías clonado, abrir la terminal en ese directorio y ejecutar **_git pull_**.

2.  Para hacer cualquier modificación crear una branch nueva con un nombre **descriptivo** y tu nombre al final. Es decir, ejecutar en la terminal lo siguiente:

    > git checkout -b **_nombreDeLaRama-tuNombre_**

## INSTALAR NPM, INICIALIZAR DB Y HACER MODIFICACIONES

1.  Abrir el vsCode donde clonamos el repositorio. Ejecutamos **_git status_** en la terminal integrada para comprobar que estamos en la rama correcta.

2.  En la terminal integrada ejecutar: **_npm install_** . Se instalarán todos los paquetes de npm.

3.  En la terminal integrada ejecutar: **_node initDB.js_** . Se inicializará la DataBase con usuarios, productos y solicitudes de compra.

4.  Copiamos el **_template.env_**. En la terminal:

    > cp template.env .env

5.  Rellenamos manualmente el **_.env_**.

6.  Para iniciar el nodemon ejecutar en la terminal integrada: **_npm run dev_**.

7.  Ya podemos hacer las modificaciones que querramos en el proyecto.

8.  Una vez hemos comprobado que todo funciona ejecutamos:

    > git status

    > git add .

    > git commit -m "**_mensaje descriptivo de lo que hemos hecho_**"

    > git push --set-upstream origin **_nombreDeLaRama-tuNombre_**

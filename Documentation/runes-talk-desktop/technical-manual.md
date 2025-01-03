# Manual Técnico

Este manual técnico proporciona instrucciones completas paso a paso para configurar, ejecutar y, opcionalmente, crear ejecutables para el proyecto. Se incluyen imágenes que demuestran los pasos, y todas las imágenes referenciadas se encuentran en la carpeta `img`. Siga cuidadosamente esta guía para garantizar una configuración y ejecución exitosas.

---

## Requisitos Previos

Antes de comenzar, asegúrese de lo siguiente:

- **Versión de Python:** Python 3.8 o superior instalado en su sistema.
- **Gestor de Paquetes:** pip instalado para gestionar las dependencias de Python.
- **Herramientas Opcionales:** `pyinstaller` para crear ejecutables (si es necesario).
- **Archivos del Proyecto:** Asegúrese de tener acceso a la carpeta del proyecto que contiene todos los archivos necesarios, como `main.py`, `requirements.txt` y `assets`.
- **Terminal/Consola de Comandos:** Familiaridad con comandos básicos de terminal.

---

## Paso 1: Configurar el Entorno Virtual

Un entorno virtual aísla las dependencias del proyecto, evitando conflictos con instalaciones globales.

1. Abra una terminal o consola de comandos.
2. Navegue al directorio del proyecto.
3. Ejecute los siguientes comandos según su sistema operativo:

### Linux/MacOS:
```bash
python3 -m venv env
source env/bin/activate
```

### Windows:
```bash
python -m venv env
env\Scripts\activate
```

4. Confirme la activación verificando que el prompt incluya `(env)` al principio.

---

## Paso 2: Instalar las Dependencias del Proyecto

Las dependencias necesarias para el proyecto están listadas en `requirements.txt`.

1. Asegúrese de que el entorno virtual esté activado.
2. Ejecute el siguiente comando para instalar las dependencias:

```bash
pip install -r requirements.txt
```

3. Verifique que la instalación haya sido exitosa revisando la salida para detectar posibles errores.

---

## Paso 3: Ejecutar la Aplicación

Para probar la aplicación:

1. Asegúrese de que el entorno virtual esté activo.
2. Ejecute el script principal:

```bash
python main.py
```

3. Observe la salida en la terminal para asegurar el funcionamiento correcto.

---

## Paso 4: Entrenar el Modelo

El proyecto incluye un módulo para el entrenamiento de un modelo de aprendizaje automático.

1. Ejecute el siguiente comando para iniciar el entrenamiento del modelo:

```bash
python logic/train_model.py
```

2. Monitoree la salida para revisar los registros relacionados con la precisión del modelo, la pérdida y el estado de finalización.

3. Al finalizar, confirme que el modelo entrenado esté guardado en la ubicación especificada.

---

## Paso 5: Crear un Ejecutable (Opcional)

Crear ejecutables permite distribuir el proyecto sin necesidad de instalaciones de Python.

### Instalar PyInstaller:

1. Si no está instalado, añada `pyinstaller` a su entorno:

```bash
pip install pyinstaller
```

### Para Linux:

1. Cree un ejecutable con el siguiente comando:

```bash
pyinstaller --onefile --windowed --name=RunesTalk \
--add-data="assets:assets" \
--add-data="dataset:dataset" \
--add-data="models:models" \
--add-data="ui:ui" \
main.py
```

2. Verifique que el ejecutable se haya generado en la carpeta `dist`.

### Para Windows:

1. Utilice el siguiente comando para crear un ejecutable:

```bash
pyinstaller --onefile --windowed --name=RunesTalk \
--add-data="assets:assets" \
--add-data="dataset:dataset" \
--add-data="models:models" \
--add-data="ui:ui" \
main.py
```

2. Confirme que el ejecutable esté presente en la carpeta `dist`.

---

## Problemas Comunes y Solución de Problemas

### Problemas con el Entorno Virtual
- **Problema:** Errores al activar el entorno virtual.
- **Solución:** Asegúrese de que Python esté añadido al PATH de su sistema. En Linux/MacOS, verifique que esté utilizando el comando `source`.

### Fallos en la Instalación de Dependencias
- **Problema:** Fallos al ejecutar el comando `pip` para instalar dependencias.
- **Solución:** Actualice `pip` usando `pip install --upgrade pip` y vuelva a intentarlo.

### Errores en PyInstaller
- **Problema:** Archivos faltantes o errores de compilación.
- **Solución:** Asegúrese de que las rutas correctas estén especificadas en la opción `--add-data` y que todos los activos necesarios estén presentes.

---

## Notas

- **Carpeta de Assets:** Asegúrese de que la carpeta `assets` esté estructurada correctamente y sea accesible durante los procesos de ejecución y compilación.
- **Depuración:** Use el modo detallado para obtener registros detallados durante la solución de problemas.
  ```bash
  pyinstaller --onefile --windowed --debug --name=RunesTalk main.py
  ```
- **Documentación:** Consulte la documentación oficial de Python y PyInstaller para configuraciones avanzadas.

Para mayor asistencia, contacte al equipo de soporte del proyecto o consulte el archivo README incluido en el directorio del proyecto.
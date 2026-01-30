# Evaluación-Técnica
Evaluación Técnica Desarrollador Web Fullstack

##  Información General

 Alvaro Gabriel Ramirez Alvarez  
 alvarogabrielramirezalvarez@gmail.com  
 Enero 2026

---

## Descripción del Proyecto

Sistema web completo para gestión de encuestas de satisfacción que permite a los usuarios responder encuestas basadas en su ubicación (País, Empresa, Sede)



---

##  Arquitectura del Sistema



**Backend:**
- Node.js 18+
- Express.js 4.x
- MySQL 8.0

**Frontend:**
- React 18.x
- Vite 5.x
- TailwindCSS 3.x

#  Instalación y Ejecución

### 1. Requisitos 


- Node.js 18+ ([Descargar](https://nodejs.org/))
- MySQL 8.0+ ([Descargar](https://dev.mysql.com/downloads/))
- Git


### 2. Configurar Backend

```bash
cd backend
npm install
```

### 3. Crear Base de Datos

```bash
npm run migrate
```

Este comando:
- Crea la base de datos 
- Crea todas las tablas necesarias
- Inserta datos de ejemplo (países, empresas, sedes, encuesta por defecto)

### 4. Iniciar Backend

```bash
npm run dev
```


### 5. Configurar Frontend

```bash
cd frontend
npm install

```

### 6. Iniciar Frontend

```bash
npm run dev
```


---
# PARTE 2: Propuesta Técnica - Aplicación Móvil

## Sistema de Encuestas para Puntos de Servicio



### Escenario de Uso

- **Ubicación**: Sedes físicas (ej: carwash, puntos de servicio)
- **Momento**: Al finalizar el servicio
- **Dispositivo**: Tablet o teléfono proporcionado por la sede
- **Usuario**: Cliente del servicio
- **Volumen inicial**: ~100 encuestas mensuales

### Requisitos Clave

  Aplicación móvil sencilla y rápida  
  Fácil uso para clientes  
  Bajo costo operativo  
  Fácil mantenimiento  
  Escalabilidad futura  

---

##  Arquitectura Propuesta



### 1. Frontend Móvil

**Flutter**


**Justificación:**
-   Desarrollo rápido (4 semanas aprox)
-   Una sola codebase para iOS y Android
-   Reutilización de conocimientos de React
-   Gran comunidad y soporte
-   Costo muy bajo de operación ($5-10/mes)

**Alternativas Consideradas:**
- Nativo (Swift/Kotlin): Doble desarrollo, mayor costo

### 2. Backend - Reutilización

**Node.js + Express (Actual)**

**Justificación:**
-   Ya está desarrollado y funcionando
-   Mismas APIs pueden servir web y móvil
-   No requiere desarrollo adicional
-   Código ya probado y documentado
-   Reduce tiempo de implementación






4. **Escalabilidad**
   - Soporta crecimiento 10x sin cambios
   - Backend ya preparado
   - Infraestructura elástica

5. **Riesgo Bajo**
   - Tecnología probada
   - Gran comunidad
   - Fácil encontrar talento




**Fecha de Propuesta:** Enero 2026  
**Versión:** 1.0  
**Autor:** Alvaro Gabriel Ramirez Alvarez


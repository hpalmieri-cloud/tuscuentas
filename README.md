# Tus Cuentas

Sitio estático de calculadoras y guías simples para Argentina. **Sin registro, sin base de datos y sin cookies propias**: todos los cálculos se ejecutan en el navegador.

- **Dominio:** `tuscuentas.com.ar` (registrado, pendiente de activación).
- **Marca:** Tus Cuentas.
- **Contacto:** `hola@tuscuentas.com.ar`.

## Calculadoras disponibles

1. Aguinaldo (SAC)
2. Sueldo neto
3. Indemnización por despido
4. Vacaciones
5. Plazo fijo
6. Cuota de préstamo (sistema francés)
7. IVA
8. Porcentajes

Próximas: Monotributo y Jubilación.

## Estructura

```
/
├─ index.html                  Página principal
├─ sobre.html                  Sobre el proyecto
├─ contacto.html               Contacto (mailto, sin formularios)
├─ privacidad.html             Política de privacidad (apta para AdSense)
├─ robots.txt                  Rastreo
├─ sitemap.xml                 Mapa del sitio (reemplazar dominio)
├─ assets/
│  ├─ styles.css               Estilos (sin frameworks)
│  └─ site.js                  Utilidades mínimas (formato ARS, copiar)
└─ calculadoras/
   ├─ aguinaldo/
   ├─ sueldo-neto/
   ├─ indemnizacion/
   ├─ vacaciones/
   ├─ plazo-fijo/
   ├─ prestamo/
   ├─ iva/
   └─ porcentaje/
```

Cada carpeta tiene `index.html` y su archivo `.js` con la lógica.

## Cómo verlo en tu PC

**Opción 1:** abrí `index.html` con doble clic.

**Opción 2:** si instalás Python, desde la carpeta del proyecto:

```powershell
python -m http.server 8000
```

Y abrí `http://localhost:8000`.

## Cómo publicarlo gratis

### Cloudflare Pages (recomendado)
1. Crear cuenta en `pages.cloudflare.com`.
2. "Create a project" → "Direct upload" (o conectar el repo de GitHub).
3. Subir la carpeta completa del proyecto.
4. URL tipo `tu-proyecto.pages.dev`.

### GitHub Pages
1. Crear un repositorio en GitHub y subir el contenido.
2. Settings → Pages → Deploy from branch → `main` / root.
3. URL: `https://usuario.github.io/repositorio/`.

## Antes de publicar (checklist)

- [ ] Reemplazar `https://tuscuentas.com.ar` en `sitemap.xml` y `robots.txt` por el dominio real.
- [ ] Reemplazar `hola@tuscuentas.com.ar` en `contacto.html` y `privacidad.html`.
- [ ] Revisar fórmulas y parámetros con la normativa vigente.
- [ ] Probar todas las calculadoras en el celular.
- [ ] Configurar Google Search Console y enviar el sitemap.

## AdSense (cuando haya contenido)

1. Publicar al menos 15–20 páginas con contenido original y útil.
2. Verificar que estén: Inicio, Sobre, Contacto y Privacidad.
3. Solicitar revisión en AdSense.
4. Recién después insertar el código de anuncios.

## Próximas calculadoras

1. Monotributo
2. Jubilación / haberes
3. Dólar / conversión
4. Interés compuesto
5. Horas extras

## Notas

- No hay dependencias ni build: HTML, CSS y JavaScript puro.
- Carpeta sincronizada con OneDrive: cerrar archivos antes de operaciones grandes de git.
- Los resultados son estimaciones informativas, no asesoramiento profesional.

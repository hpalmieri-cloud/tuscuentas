# Tus Cuentas

Sitio estático de calculadoras y guías simples para Argentina. **Sin registro, sin base de datos y sin cookies propias**: todos los cálculos se ejecutan en el navegador.

- **Dominio:** `tuscuentas.com.ar` (registrado, pendiente de activación).
- **Marca:** Tus Cuentas.
- **Contacto:** `hola@tuscuentas.com.ar` (los mensajes se reciben en una casilla real; el alias del dominio queda pendiente de activación).

## Calculadoras disponibles

1. Aguinaldo (SAC)
2. Sueldo neto
3. Indemnización por despido
4. Vacaciones
5. Plazo fijo
6. Cuota de préstamo (sistema francés)
7. IVA
8. Porcentajes
9. Monotributo (tabla ARCA vigente desde el 1/8/2026)
10. Jubilación (régimen general)
11. Dólar (conversión ARS ↔ USD)
12. Interés compuesto
13. Horas extras

## Guías disponibles

1. Cómo se calcula el aguinaldo
2. Cómo leer un recibo de sueldo
3. Monotributo: inscripción y recategorización
4. Trámite de jubilación en ANSES

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
├─ guias/
│  ├─ index.html               Índice de guías
│  ├─ aguinaldo-como-se-calcula/
│  ├─ recibo-de-sueldo/
│  ├─ monotributo-como-inscribirse/
│  └─ jubilacion-tramite-anses/
└─ calculadoras/
   ├─ aguinaldo/
   ├─ sueldo-neto/
   ├─ indemnizacion/
   ├─ vacaciones/
   ├─ plazo-fijo/
   ├─ prestamo/
   ├─ iva/
   ├─ porcentaje/
   ├─ monotributo/
   ├─ jubilacion/
   ├─ dolar/
   ├─ interes-compuesto/
   └─ horas-extras/
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

## Dominio propio

El `CNAME` está preparado en `deploy/CNAME`, pero **no está activo** para no romper la URL de github.io mientras el DNS no apunte a GitHub.

- Instrucciones completas: [DOMINIO.md](DOMINIO.md)
- Activación segura, con verificación de DNS previa: `deploy\activar-dominio.ps1`

## Antes de publicar (checklist)

- [ ] Reemplazar `https://tuscuentas.com.ar` en `sitemap.xml` y `robots.txt` por el dominio real.
- [x] Enviar los mensajes de contacto a una casilla real, mostrando `hola@tuscuentas.com.ar` como dirección pública.
- [ ] Configurar el reenvío real de `hola@tuscuentas.com.ar` cuando el dominio esté activo (ImprovMX o Cloudflare Email Routing).
- [ ] Revisar fórmulas y parámetros con la normativa vigente.
- [ ] Probar todas las calculadoras en el celular.
- [ ] Configurar Google Search Console y enviar el sitemap.
- [ ] Activar el dominio propio siguiendo `DOMINIO.md`.

## AdSense (en preparación)

1. [x] Publicar 15–20 páginas con contenido original y útil (hoy hay 22: inicio, 13 calculadoras, 5 guías y 3 legales).
2. [x] Incluir Inicio, Sobre, Contacto, Privacidad y Guías.
3. [x] Detallar publicidad y cookies en la política de privacidad.
4. [ ] Crear la cuenta en `adsense.google.com`.
5. [ ] Agregar el sitio y copiar el script de verificación en el `<head>`.
6. [ ] Crear `ads.txt` con el publisher ID (`pub-...`).
7. [ ] Solicitar la revisión (puede tardar días o semanas).
8. [ ] Después de la aprobación: insertar los bloques de anuncio y activar el mensaje de consentimiento para EEA/Reino Unido.

**Importante:** no insertar bloques de anuncios antes de la aprobación.

## Próximas calculadoras

1. Sueldo para jubilados
2. Ahorro / meta de ahorro
3. Conversor de unidades
4. Más guías de trámites (ANSES, ARCA)

## Notas

- No hay dependencias ni build: HTML, CSS y JavaScript puro.
- Carpeta sincronizada con OneDrive: cerrar archivos antes de operaciones grandes de git.
- Los resultados son estimaciones informativas, no asesoramiento profesional.

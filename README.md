# Calculá Argentina

Sitio estático de calculadoras y guías simples para Argentina. **Sin registro, sin base de datos y sin cookies propias**: todos los cálculos se ejecutan en el navegador.

## Estado

- Calculadora de **aguinaldo (SAC)** funcionando.
- Páginas institucionales: Inicio, Sobre, Contacto y Privacidad.
- Listo para publicar gratis (Cloudflare Pages, Netlify o GitHub Pages).

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
│  └─ site.js                  Utilidades mínimas
└─ calculadoras/
   └─ aguinaldo/
      ├─ index.html            Calculadora de aguinaldo
      └─ aguinaldo.js          Lógica del cálculo
```

## Cómo verlo en tu PC

**Opción 1:** abrí `index.html` con doble clic.

**Opción 2 (recomendada):** si tenés Python instalado, desde la carpeta del proyecto:

```powershell
python -m http.server 8000
```

Y abrí `http://localhost:8000` en el navegador.

## Cómo publicarlo gratis

### Cloudflare Pages (recomendado)
1. Crear cuenta en `pages.cloudflare.com`.
2. "Create a project" → "Direct upload" (o conectar el repo de GitHub).
3. Subir la carpeta completa del proyecto.
4. Te da una URL tipo `tu-proyecto.pages.dev`.

### GitHub Pages
1. Crear un repositorio en GitHub y subir el contenido.
2. Settings → Pages → Deploy from branch → `main` / root.
3. URL: `https://usuario.github.io/repositorio/`.

## Antes de publicar (checklist)

- [ ] Reemplazar `https://calculaargentina.com` en `sitemap.xml` y `robots.txt` por el dominio real.
- [ ] Reemplazar `hola@calculaargentina.com` en `contacto.html` y `privacidad.html`.
- [ ] Revisar datos de la calculadora con la normativa vigente.
- [ ] Probar en el celular.
- [ ] Configurar Google Search Console y enviar el sitemap.

## AdSense (cuando haya contenido)

1. Publicar al menos 15–20 páginas con contenido original y útil.
2. Verificar que estén: Inicio, Sobre, Contacto y Privacidad.
3. Solicitar revisión en AdSense.
4. Recién después insertar el código de anuncios.

## Próximas calculadoras

1. Sueldo neto
2. Indemnización por despido
3. Monotributo
4. Plazo fijo
5. Jubilación / haberes

## Notas

- No hay dependencias ni build: HTML, CSS y JavaScript puro.
- Carpeta sincronizada con OneDrive: cerrar archivos antes de operaciones grandes de git.
- Los resultados son estimaciones informativas, no asesoramiento profesional.

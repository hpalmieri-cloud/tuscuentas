# Dominio propio: tuscuentas.com.ar

Guía para conectar el dominio de nic.ar con GitHub Pages sin dejar el sitio caído.

## Estado actual

- Dominio **registrado en nic.ar**, pendiente de activación.
- El sitio se publica hoy en `https://hpalmieri-cloud.github.io/tuscuentas/`.
- El archivo `CNAME` está preparado en `deploy/CNAME`, pero **no se subió al repo**.
- `sitemap.xml` y `robots.txt` ya usan `https://tuscuentas.com.ar/`.

## Por qué no se activa todavía

Cuando GitHub Pages encuentra un archivo `CNAME` en la raíz del repo, redirige todo el sitio a ese dominio. Si el DNS todavía no apunta a GitHub, el resultado es que **el sitio queda inaccesible**, incluida la URL de github.io.

Por eso el orden correcto es siempre:

1. Configurar el DNS.
2. Verificar que el dominio ya resuelve a GitHub.
3. Recién ahí subir el `CNAME`.

## Paso 1: cargar el DNS en nic.ar

Entrá al panel de nic.ar, buscá la administración de DNS de `tuscuentas.com.ar` y cargá estos registros:

| Tipo | Nombre / Host | Valor | TTL |
|------|---------------|-------|-----|
| A | `@` (o vacío) | `185.199.108.153` | 300 |
| A | `@` (o vacío) | `185.199.109.153` | 300 |
| A | `@` (o vacío) | `185.199.110.153` | 300 |
| A | `@` (o vacío) | `185.199.111.153` | 300 |
| CNAME | `www` | `hpalmieri-cloud.github.io` | 300 |

Notas:

- Si el panel pide el nombre con punto final, usá `hpalmieri-cloud.github.io.`
- **No** cargues un CNAME en `@`: el dominio raíz va con los cuatro registros A.
- Si hay un registro A de parking o de otro proveedor, reemplazalo por estos.
- El TTL en 300 segundos acelera la propagación mientras probás. Después podés subirlo a 3600.

Opcional: si querés soporte IPv6, agregá también estos AAAA:

| Tipo | Nombre | Valor |
|------|--------|-------|
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

## Paso 2: verificar la propagación

En PowerShell:

```powershell
Resolve-DnsName tuscuentas.com.ar -Type A
Resolve-DnsName www.tuscuentas.com.ar -Type CNAME
```

También podés usar un resolutor público para saltear la caché local:

```powershell
nslookup tuscuentas.com.ar 8.8.8.8
nslookup www.tuscuentas.com.ar 8.8.8.8
```

Qué tenés que ver:

- `tuscuentas.com.ar` devuelve una o más de las IP `185.199.10x.153`.
- `www.tuscuentas.com.ar` devuelve `hpalmieri-cloud.github.io`.

La propagación puede tardar desde unos minutos hasta 24–48 horas, aunque en nic.ar suele ser bastante más rápido.

## Paso 3: activar el CNAME

### Opción recomendada: script con verificación previa

Desde la carpeta del proyecto:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\activar-dominio.ps1
```

El script:

1. Consulta el DNS de `tuscuentas.com.ar`.
2. Aborta si todavía no apunta a GitHub Pages.
3. Copia `deploy/CNAME` a la raíz del repo.
4. Hace commit y push.
5. Te recuerda los pasos que siguen en GitHub.

### Opción manual

1. Copiá `deploy/CNAME` a la raíz del proyecto (debe quedar `CNAME` junto a `index.html`).
2. Verificá que el contenido sea exactamente `tuscuentas.com.ar`.
3. `git add CNAME`, commit y push.

### Opción desde GitHub

También podés ir a **Settings → Pages → Custom domain**, escribir `tuscuentas.com.ar` y guardar. GitHub crea el `CNAME` automáticamente. No combines esta opción con las anteriores al mismo tiempo: es una u otra.

## Paso 4: configurar GitHub Pages

1. En el repo: **Settings → Pages**.
2. En **Custom domain**, escribí `tuscuentas.com.ar` y guardá.
3. Esperá a que aparezca **DNS check successful**.
4. Marcá **Enforce HTTPS**. El certificado puede tardar hasta 24 horas en emitirse.
5. No cambies la rama de publicación: sigue siendo `main` / root.

## Paso 5: verificar el resultado

```powershell
Invoke-WebRequest https://tuscuentas.com.ar -UseBasicParsing
Invoke-WebRequest https://www.tuscuentas.com.ar -UseBasicParsing
Invoke-WebRequest https://hpalmieri-cloud.github.io/tuscuentas/ -UseBasicParsing
```

Resultado esperado:

- `https://tuscuentas.com.ar` devuelve **200**.
- `https://www.tuscuentas.com.ar` redirige al dominio principal.
- La URL de github.io redirige a `tuscuentas.com.ar`.
- `https://tuscuentas.com.ar/sitemap.xml` y `/robots.txt` responden bien.

## Correo: no tocar los MX

Los registros A y CNAME son solo para la web. El correo usa registros **MX**, que son independientes. Cuando quieras activar `hola@tuscuentas.com.ar`:

1. Creá una cuenta gratuita en ImprovMX.
2. Agregá el dominio y el alias `hola@tuscuentas.com.ar` → `hpbusqueda@gmail.com`.
3. Cargá en nic.ar los MX que te indique ImprovMX (`mx1.improvmx.com` y `mx2.improvmx.com`, prioridades 10 y 20).
4. Verificá el reenvío y recién ahí cambiá los `mailto:` del sitio.

No borres los MX que ya existan sin revisar qué servicio los usa.

## Si algún día movés el DNS a Cloudflare

- Para GitHub Pages, los registros del dominio deben quedar en **DNS only** (nube gris), sin proxy naranja.
- El proxy de Cloudflare puede interferir con la validación del certificado de GitHub Pages.
- Si preferís Cloudflare Pages, entonces sí podés usar el proxy, pero es otro esquema de publicación.

## Cómo volver atrás

Si algo sale mal:

1. Borrá el `CNAME` de la raíz: `git rm CNAME`, commit y push.
2. En GitHub: **Settings → Pages → Custom domain**, vaciá el campo y guardá.
3. El sitio vuelve a `https://hpalmieri-cloud.github.io/tuscuentas/`.
4. Los registros DNS pueden quedar cargados: no molestan.

## Relación con AdSense

AdSense no acepta una URL con subcarpeta como `github.io/tuscuentas/`. Por eso el orden es:

1. Dominio funcionando con HTTPS.
2. Alta del sitio en Google Search Console y envío del sitemap.
3. Creación de la cuenta de AdSense y verificación del dominio.
4. Solicitud de revisión.

Cuando tengas el publisher ID (`ca-pub-...`), avisame y preparo el script de AdSense y el `ads.txt`.

## Referencias

- GitHub Docs: *Managing a custom domain for your GitHub Pages site*.
- GitHub Docs: *Troubleshooting custom domains and GitHub Pages*.
- nic.ar: administración de DNS del dominio.

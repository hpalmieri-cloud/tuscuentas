# Dominio propio: tuscuentas.com.ar

Guía de referencia para conectar el dominio con GitHub Pages sin dejar el sitio caído.

## Estado actual (noviembre de 2026)

- **Dominio activo:** `https://tuscuentas.com.ar` responde 200.
- **DNS:** administrado en **Cloudflare** (nameservers `guss.ns.cloudflare.com` y `chin.ns.cloudflare.com`), con los registros en **DNS only** (nube gris).
- **Registros:** cuatro A en el dominio raíz apuntando a `185.199.108–111.153` y CNAME `www` → `hpalmieri-cloud.github.io`.
- **Certificado:** Let's Encrypt emitido por GitHub Pages, `CN=tuscuentas.com.ar`, SAN con `tuscuentas.com.ar` y `www.tuscuentas.com.ar`, vence el 13/02/2027.
- **Custom domain:** configurado en GitHub → Settings → Pages; el archivo `CNAME` está en la raíz del repo.
- **Enforce HTTPS:** habilitado.
- `sitemap.xml` y `robots.txt` usan `https://tuscuentas.com.ar/`.

> El registro `deploy/CNAME` y el script `deploy/activar-dominio.ps1` quedaron como respaldo histórico: el dominio ya está activo, así que no hace falta ejecutarlos.

## Por qué el orden importa

Cuando GitHub Pages encuentra un archivo `CNAME` en la raíz del repo, redirige todo el sitio a ese dominio. Si el DNS todavía no apunta a GitHub, el resultado es que **el sitio queda inaccesible**, incluida la URL de github.io.

Por eso el orden correcto es siempre:

1. Configurar el DNS.
2. Verificar que el dominio ya resuelve a GitHub.
3. Recién ahí subir el `CNAME`.

## Paso 1: cargar el DNS

El dominio está registrado en nic.ar, pero los registros se administran en **Cloudflare** (ahí apuntan los nameservers). Entrá a **Cloudflare → DNS → Records** y cargá:

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

La propagación puede tardar desde unos minutos hasta 24–48 horas, aunque con Cloudflare suele ser cuestión de minutos.

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

## Si “Enforce HTTPS” queda grisada

Es el problema más común y casi siempre se debe a uno de estos dos motivos.

### 1. El CNAME de `www` apunta mal

GitHub valida el dominio completo (raíz **y** `www`) antes de habilitar el certificado. Si el CNAME de `www` apunta a un host inexistente, la casilla queda deshabilitada aunque la raíz funcione.

Verificá:

```powershell
Resolve-DnsName www.tuscuentas.com.ar -Type CNAME
nslookup www.tuscuentas.com.ar 8.8.8.8
```

Tiene que devolver `hpalmieri-cloud.github.io`. Errores frecuentes: `hpalmieri.github.io` (otra cuenta), `hpalmieri-github.io` (falta `-cloud.`) o un dominio que no resuelve.

### 2. GitHub todavía no revalidó

Después de corregir el DNS, GitHub puede tardar entre 15 minutos y 24 horas en volver a chequear. Mientras tanto:

- No cambies el dominio personalizado.
- No borres el `CNAME`.
- Refrescá Settings → Pages con **Ctrl + F5** cada tanto.

### 3. Cómo comprobar el certificado real

```powershell
$tcp = New-Object Net.Sockets.TcpClient('tuscuentas.com.ar', 443)
$cb  = [System.Net.Security.RemoteCertificateValidationCallback]{ param($s,$c,$ch,$e) $true }
$ssl = New-Object Net.Security.SslStream($tcp.GetStream(), $false, $cb)
$ssl.AuthenticateAsClient('tuscuentas.com.ar')
$cert = [System.Security.Cryptography.X509Certificates.X509Certificate2]$ssl.RemoteCertificate
$cert.Subject
$cert.NotAfter
($cert.Extensions | Where-Object { $_.Oid.Value -eq '2.5.29.17' }).Format($false)
$ssl.Dispose(); $tcp.Close()
```

Si el subject es `CN=tuscuentas.com.ar` y el SAN incluye `www`, el certificado ya está emitido y solo falta que la casilla se habilite.

### 4. Plan B: forzar HTTPS desde Cloudflare

Si GitHub no lo habilita en 24 horas, podés volver a poner el proxy naranja y dejar que Cloudflare haga el redirect:

1. **SSL/TLS → Overview** → modo **Full (strict)** (ya hay certificado válido en el origen).
2. **SSL/TLS → Edge Certificates** → **Always Use HTTPS** en ON.
3. **SSL/TLS → Edge Certificates** → **Automatic HTTPS Rewrites** en ON.

Con eso `http://` redirige a `https://` aunque GitHub no lo fuerce. La desventaja es que el cifrado lo termina Cloudflare, no GitHub.

## Correo: no tocar los MX

Los registros A y CNAME son solo para la web. El correo usa registros **MX**, que son independientes. Cuando quieras activar `hola@tuscuentas.com.ar`:

1. Creá una cuenta gratuita en ImprovMX.
2. Agregá el dominio y el alias `hola@tuscuentas.com.ar` → `hpbusqueda@gmail.com`.
3. Cargá en **Cloudflare → DNS** los MX que te indique ImprovMX (`mx1.improvmx.com` y `mx2.improvmx.com`, prioridades 10 y 20).
4. Verificá el reenvío y recién ahí cambiá los `mailto:` del sitio.

No borres los MX que ya existan sin revisar qué servicio los usa.

## Notas sobre Cloudflare

- Mientras el DNS esté en **DNS only** (nube gris), GitHub Pages emite y renueva su certificado sin interferencias. Es la configuración actual y la recomendada.
- Si activás el proxy naranja, usá **Full (strict)**: el origen ya tiene certificado válido.
- No uses **Flexible** con GitHub Pages: genera loops de redirección y deja el tráfico sin cifrar entre Cloudflare y GitHub.
- Si en algún momento preferís Cloudflare Pages, ahí sí podés usar el proxy sin problema, pero es otro esquema de publicación.

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

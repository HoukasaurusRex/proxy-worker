const index = `
<!doctype html>
<html>
  <head>
    <title>JT | Proxy</title>
    <style>
    body {
      font-family: "SF Pro Text","SF Pro Icons","Helvetica Neue","Helvetica","Arial",sans-serif;
      padding: 20px 20px 60px;
      max-width: 680px;
      margin: 0 auto;
      font-size: 16px;
      line-height: 1.65;
      word-break: break-word;
      font-kerning: auto;
      font-variant: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      hyphens: auto;
      text-align: center;
    }
    
    h2, h3, h4 {
      margin-top: 1.5em;
    }
    
    h1 {
      margin-top: 70px; 
      text-align: center; 
      font-size: 45px; 
    } 
    
    a {
      cursor: pointer;
      color: #0076FF;
      text-decoration: none;
      transition: all 0.2s ease;
      border-bottom: 1px solid white;
    }
    
    a:hover {
      border-bottom: 1px solid #0076FF;
    }
    
    code, pre {
      font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
      font-size: .92em;
      color: #D400FF;
    }
    
    code:before, code:after {
      content: '\`';
    }
    
    p {
      text-align: center; 
      font-size: 16px; 
    } 
    </style>
  </head>
  <body>
    <h1>Welcome my Proxy Worker</h1>
    <h2>Deployed with <a href="https://workers.cloudflare.com/docs" target="_blank" rel="noreferrer noopener">Cloudflare Workers</a>!</h2>
    <br />
    <h3>Try proxying requests by adding URI-encoded URLs above 👆🏼</h3>
    <br />
    <h3>Or you can try out some links from down below 👇🏼</h3>
    <ul>
      <li><a target="_blank" href="https://proxy.terminallychill.workers.dev/https%3A%2F%2Fcnn.com">CNN</a></li>
      <li><a target="_blank" href="https://proxy.terminallychill.workers.dev/https%3A%2F%2Fnytimes.com">NYTimes</a></li>
      <li><a target="_blank" href="https://proxy.terminallychill.workers.dev/https%3A%2F%2Fbaidu.com">Baidu</a></li>
    </ul>
    <br />
    <h3>Advanced: try running a POST request through the proxy as well!</h3>
    <!-- TODO: add video -->

    <script>
      // TODO: encode URI from input and add to link
      function main() {
      }
    </script>
  </body>
</html>
`

const workerDomains = [
  'https://workers.houk.space/proxy/',
  'https://proxy.terminallychill.workers.dev/'
]

const decodeForwardURI = (domainsList, uri) => {
  const [thisDomain] = domainsList.filter(domain => uri.includes(domain))
  const encodedForwardURI = uri.replace(thisDomain, '')
  return decodeURIComponent(encodedForwardURI)
}

const returnHTMLResponse = html =>
  new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    }
  })

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
  const options = {}
  try {
    const body = await request.json()
    options.method = 'POST'
    options.body = JSON.stringify(body)
  } catch (error) {
    options.method = 'GET'
  } finally {
    const forwardTo = decodeForwardURI(workerDomains, request.url)
    const res =
      forwardTo === '' || forwardTo === '/'
        ? returnHTMLResponse(index)
        : await fetch(forwardTo, options)
    return res
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

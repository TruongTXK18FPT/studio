import { NextRequest, NextResponse } from 'next/server';

const MUSEUM_BASE_URL = 'http://baotanghochiminh.baotangao.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';
    
    // Construct the target URL
    const targetUrl = `${MUSEUM_BASE_URL}${path}`;
    
    console.log('Proxying request to:', targetUrl);
    
    // Fetch from the HTTP museum site
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
        'Referer': MUSEUM_BASE_URL,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'text/html';
    let content: string | Uint8Array;

    // Handle different content types
    if (contentType.includes('text/') || contentType.includes('application/json')) {
      content = await response.text();
      
      // If it's HTML, rewrite URLs to use our proxy
      if (contentType.includes('text/html')) {
        content = rewriteUrls(content, request.url);
      }
    } else {
      // For binary content (images, CSS, JS, etc.)
      const arrayBuffer = await response.arrayBuffer();
      content = new Uint8Array(arrayBuffer);
    }

    // Create response with proper headers
    const proxyResponse = new NextResponse(content as BodyInit, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        // Remove X-Frame-Options to allow iframe
        'Content-Security-Policy': 'frame-ancestors *',
        // Add cache headers
        'Cache-Control': 'public, max-age=300',
      },
    });

    return proxyResponse;

  } catch (error) {
    console.error('Proxy error:', error);
    
    return NextResponse.json(
      { 
        error: 'Proxy failed', 
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Sửa function rewriteUrls
function rewriteUrls(html: string, baseUrl: string): string {
  const proxyBaseUrl = new URL('/api/proxy/museum', baseUrl).toString();
  
  return html
    // Fix absolute URLs to museum domain
    .replace(new RegExp(`${MUSEUM_BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'), proxyBaseUrl + '?path=')
    
    // Fix relative URLs starting with /
    .replace(/(src|href|action)=["']\/([^"']*)["']/g, `$1="${proxyBaseUrl}?path=/$2"`)
    
    // Fix relative URLs without leading /
    .replace(/(src|href|action)=["'](?!https?:\/\/|data:|#|\/\/)([^"']*)["']/g, `$1="${proxyBaseUrl}?path=/$2"`)
    
    // Fix CSS url() functions
    .replace(/url\(["']?\/([^"')]*)["']?\)/g, `url("${proxyBaseUrl}?path=/$1")`)
    .replace(/url\(["']?(?!https?:\/\/|data:)([^"')]*)["']?\)/g, `url("${proxyBaseUrl}?path=/$1")`)
    
    // Remove existing base tag and add new one
    .replace(/<base[^>]*>/gi, '')
    .replace(/<head[^>]*>/i, `$&\n<base href="${proxyBaseUrl}?path=/">`)
    
    // Enhanced dynamic fixing script
    .replace(/<\/body>/i, `
      <script>
        (function() {
          const proxyBase = '${proxyBaseUrl}?path=';
          const museumBase = '${MUSEUM_BASE_URL}';
          
          // Override fetch to use proxy
          const originalFetch = window.fetch;
          window.fetch = function(url, options) {
            if (typeof url === 'string' && url.startsWith(museumBase)) {
              url = url.replace(museumBase, proxyBase);
            }
            return originalFetch.call(this, url, options);
          };
          
          // Override XMLHttpRequest
          const originalXHROpen = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (typeof url === 'string' && url.startsWith(museumBase)) {
              url = url.replace(museumBase, proxyBase);
            }
            return originalXHROpen.call(this, method, url, ...args);
          };
          
          // Fix dynamic content
          const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                  fixElement(node);
                  node.querySelectorAll && node.querySelectorAll('[src], [href]').forEach(fixElement);
                }
              });
            });
          });
          
          function fixElement(el) {
            ['src', 'href'].forEach(attr => {
              const val = el.getAttribute && el.getAttribute(attr);
              if (val && !val.startsWith('http') && !val.startsWith('data:') && !val.startsWith('#')) {
                el.setAttribute(attr, proxyBase + (val.startsWith('/') ? val.slice(1) : val));
              }
            });
          }
          
          observer.observe(document.body, { childList: true, subtree: true });
          
          // Fix existing elements
          document.querySelectorAll('[src], [href]').forEach(fixElement);
        })();
      </script>
      $&
    `);
}
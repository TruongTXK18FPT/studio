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

// Function to rewrite URLs in HTML content
function rewriteUrls(html: string, baseUrl: string): string {
  const proxyBaseUrl = new URL('/api/proxy/museum', baseUrl).toString();
  
  // Rewrite relative URLs to use our proxy
  return html
    // Rewrite src attributes
    .replace(/src=["']\/([^"']*)["']/g, `src="${proxyBaseUrl}?path=/$1"`)
    .replace(/src=["']([^"'http][^"']*)["']/g, `src="${proxyBaseUrl}?path=/$1"`)
    
    // Rewrite href attributes  
    .replace(/href=["']\/([^"']*)["']/g, `href="${proxyBaseUrl}?path=/$1"`)
    .replace(/href=["']([^"'http][^"']*)["']/g, `href="${proxyBaseUrl}?path=/$1"`)
    
    // Rewrite action attributes
    .replace(/action=["']\/([^"']*)["']/g, `action="${proxyBaseUrl}?path=/$1"`)
    
    // Rewrite CSS url() functions
    .replace(/url\(["']?\/([^"')]*)["']?\)/g, `url("${proxyBaseUrl}?path=/$1")`)
    
    // Add base tag to handle relative URLs
    .replace(/<head[^>]*>/i, `$&\n<base href="${proxyBaseUrl}?path=/" target="_parent">`)
    
    // Inject script to fix any remaining issues
    .replace(/<\/body>/i, `
      <script>
        // Fix any remaining relative URLs dynamically
        document.addEventListener('DOMContentLoaded', function() {
          const proxyBase = '${proxyBaseUrl}?path=';
          
          // Fix images
          document.querySelectorAll('img').forEach(img => {
            if (img.src && img.src.startsWith('${MUSEUM_BASE_URL}')) {
              img.src = img.src.replace('${MUSEUM_BASE_URL}', proxyBase);
            }
          });
          
          // Fix links
          document.querySelectorAll('a').forEach(link => {
            if (link.href && link.href.startsWith('${MUSEUM_BASE_URL}')) {
              link.href = link.href.replace('${MUSEUM_BASE_URL}', proxyBase);
            }
          });
          
          // Override window.open to use proxy
          const originalOpen = window.open;
          window.open = function(url, target, features) {
            if (url && url.startsWith('${MUSEUM_BASE_URL}')) {
              url = url.replace('${MUSEUM_BASE_URL}', proxyBase);
            }
            return originalOpen.call(this, url, target, features);
          };
        });
      </script>
      $&
    `);
}
interface URLComponents {
    protocol: string;
    host: string;
    domain: string;
    path: string;
  }
  
export function extractURLComponents(url: string): URLComponents | null {
    try {
      const { protocol, host, pathname } = new URL(url);
  
      // Extract domain from host (for cases like "www.example.com")
      const domain = host.replace(/^www\./, '');
  
      return {
        protocol,
        host,
        domain,
        path: pathname
      };
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  }
  
 
  
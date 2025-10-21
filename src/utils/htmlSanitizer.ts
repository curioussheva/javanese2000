// ✅ PERBAIKAN: Simple sanitization tanpa DOMPurify dulu
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  return html
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\son\w+=\w+/gi, '')
    // Remove javascript: links
    .replace(/href="javascript:[^"]*"/gi, 'href="#"')
    .replace(/href='javascript:[^']*'/gi, "href='#'")
    // Remove other dangerous protocols
    .replace(/src="data:[^"]*"/gi, 'src="#"')
    .replace(/src='data:[^']*'/gi, "src='#'");
};

export const isContentSafe = (html: string): boolean => {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /onclick/i,
    /onload/i,
    /onerror/i,
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(html));
};

// Fallback function
export const basicSanitizeHTML = sanitizeHTML;
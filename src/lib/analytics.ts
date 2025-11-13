// Google Analytics 4 integration

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // TODO: Replace with actual GA4 ID

export const track = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    console.log('Analytics event:', eventName, params);
  }
};

export const trackLeadSubmit = (courseId: string) => {
  track('lead_submit', {
    event_category: 'Lead',
    event_label: courseId,
    value: 1,
  });
};

export const trackWhatsAppClick = (source: string) => {
  track('whatsapp_click', {
    event_category: 'Engagement',
    event_label: source,
  });
};

export const trackCTAClick = (ctaName: string, destination: string) => {
  track('cta_click', {
    event_category: 'CTA',
    event_label: ctaName,
    destination,
  });
};

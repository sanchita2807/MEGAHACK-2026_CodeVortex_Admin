import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: Translations = {
    en: {
      'brand': 'SmartStock',
      'mainMenu': 'Main Menu',
      'dashboard': 'Dashboard',
      'scanInvoice': 'Scan Invoice (OCR)',
      'inventory': 'Inventory',
      'alertsReorders': 'Alerts & Reorders',
      'integration': 'Integration',
      'exportExcel': 'Export to Excel',
      'tallySync': 'Tally Sync',
      'allDataSynced': 'All data synced',
      'admin': 'Admin',
      'inventoryOverview': 'Inventory Overview',
      'smartExtraction': 'Smart extraction and stock management',
      'exportReport': 'Export Report',
      'scanNewInvoice': 'Scan New Invoice',
      'scanning': 'Scanning...',
      'totalItems': 'Total Items in Stock',
      'fromRecentScans': 'from recent scans',
      'lowStockAlerts': 'Low Stock Alerts',
      'needsReordering': 'Needs reordering today',
      'invoicesScanned': 'Invoices Scanned',
      'todayAccuracy': 'Today, 98% accuracy',
      'totalInventoryValue': 'Total Inventory Value',
      'updatedMinsAgo': 'Updated 5 mins ago',
      'recentInvoiceScans': 'Recent Invoice Scans (OCR)',
      'viewAll': 'View All',
      'vendorDate': 'Vendor / Date',
      'status': 'Status',
      'itemsExtracted': 'Items Extracted',
      'amount': 'Amount',
      'autoSynced': 'Auto-Synced',
      'needsReview': 'Needs Review',
      'lowStockAlertsTitle': 'Low-Stock Alerts',
      'productName': 'Product Name',
      'stockLeft': 'Stock Left',
      'min': 'Min',
      'units': 'units',
      'noLowStock': 'No low stock items',
      'generateReorderList': 'Generate Reorder List',
      'processingInvoice': 'Processing Invoice...',
      'extractingItems': 'Extracting items and syncing with Tally'
    },
    hi: {
      'brand': 'स्मार्टस्टॉक',
      'mainMenu': 'मुख्य मेनू',
      'dashboard': 'डैशबोर्ड',
      'scanInvoice': 'चालान स्कैन करें (OCR)',
      'inventory': 'इन्वेंटरी',
      'alertsReorders': 'अलर्ट और पुनः ऑर्डर',
      'integration': 'एकीकरण',
      'exportExcel': 'एक्सेल में निर्यात करें',
      'tallySync': 'टैली सिंक',
      'allDataSynced': 'सभी डेटा सिंक हो गया',
      'admin': 'व्यवस्थापक',
      'inventoryOverview': 'इन्वेंटरी अवलोकन',
      'smartExtraction': 'स्मार्ट निष्कर्षण और स्टॉक प्रबंधन',
      'exportReport': 'रिपोर्ट निर्यात करें',
      'scanNewInvoice': 'नया चालान स्कैन करें',
      'scanning': 'स्कैन हो रहा है...',
      'totalItems': 'स्टॉक में कुल आइटम',
      'fromRecentScans': 'हाल के स्कैन से',
      'lowStockAlerts': 'कम स्टॉक अलर्ट',
      'needsReordering': 'आज पुनः ऑर्डर की आवश्यकता है',
      'invoicesScanned': 'स्कैन किए गए चालान',
      'todayAccuracy': 'आज, 98% सटीकता',
      'totalInventoryValue': 'कुल इन्वेंटरी मूल्य',
      'updatedMinsAgo': '5 मिनट पहले अपडेट किया गया',
      'recentInvoiceScans': 'हाल के चालान स्कैन (OCR)',
      'viewAll': 'सभी देखें',
      'vendorDate': 'विक्रेता / तारीख',
      'status': 'स्थिति',
      'itemsExtracted': 'निकाले गए आइटम',
      'amount': 'राशि',
      'autoSynced': 'ऑटो-सिंक',
      'needsReview': 'समीक्षा की आवश्यकता',
      'lowStockAlertsTitle': 'कम स्टॉक अलर्ट',
      'productName': 'उत्पाद का नाम',
      'stockLeft': 'शेष स्टॉक',
      'min': 'न्यूनतम',
      'units': 'इकाइयाँ',
      'noLowStock': 'कोई कम स्टॉक आइटम नहीं',
      'generateReorderList': 'पुनः ऑर्डर सूची बनाएं',
      'processingInvoice': 'चालान संसाधित हो रहा है...',
      'extractingItems': 'आइटम निकाले जा रहे हैं और टैली के साथ सिंक हो रहे हैं'
    },
    mr: {
      'brand': 'स्मार्टस्टॉक',
      'mainMenu': 'मुख्य मेनू',
      'dashboard': 'डॅशबोर्ड',
      'scanInvoice': 'बीजक स्कॅन करा (OCR)',
      'inventory': 'इन्व्हेंटरी',
      'alertsReorders': 'सूचना आणि पुन्हा ऑर्डर',
      'integration': 'एकत्रीकरण',
      'exportExcel': 'एक्सेलमध्ये निर्यात करा',
      'tallySync': 'टॅली सिंक',
      'allDataSynced': 'सर्व डेटा सिंक झाला',
      'admin': 'प्रशासक',
      'inventoryOverview': 'इन्व्हेंटरी विहंगावलोकन',
      'smartExtraction': 'स्मार्ट एक्स्ट्रॅक्शन आणि स्टॉक व्यवस्थापन',
      'exportReport': 'अहवाल निर्यात करा',
      'scanNewInvoice': 'नवीन बीजक स्कॅन करा',
      'scanning': 'स्कॅन होत आहे...',
      'totalItems': 'स्टॉकमधील एकूण वस्तू',
      'fromRecentScans': 'अलीकडील स्कॅनमधून',
      'lowStockAlerts': 'कमी स्टॉक सूचना',
      'needsReordering': 'आज पुन्हा ऑर्डर करणे आवश्यक',
      'invoicesScanned': 'स्कॅन केलेले बीजक',
      'todayAccuracy': 'आज, 98% अचूकता',
      'totalInventoryValue': 'एकूण इन्व्हेंटरी मूल्य',
      'updatedMinsAgo': '5 मिनिटांपूर्वी अपडेट केले',
      'recentInvoiceScans': 'अलीकडील बीजक स्कॅन (OCR)',
      'viewAll': 'सर्व पहा',
      'vendorDate': 'विक्रेता / तारीख',
      'status': 'स्थिती',
      'itemsExtracted': 'काढलेल्या वस्तू',
      'amount': 'रक्कम',
      'autoSynced': 'ऑटो-सिंक',
      'needsReview': 'पुनरावलोकन आवश्यक',
      'lowStockAlertsTitle': 'कमी स्टॉक सूचना',
      'productName': 'उत्पादनाचे नाव',
      'stockLeft': 'उरलेला स्टॉक',
      'min': 'किमान',
      'units': 'युनिट्स',
      'noLowStock': 'कमी स्टॉक वस्तू नाहीत',
      'generateReorderList': 'पुन्हा ऑर्डर यादी तयार करा',
      'processingInvoice': 'बीजक प्रक्रिया करत आहे...',
      'extractingItems': 'वस्तू काढत आहे आणि टॅलीसह सिंक करत आहे'
    },
    gu: {
      'brand': 'સ્માર્ટસ્ટોક',
      'mainMenu': 'મુખ્ય મેનુ',
      'dashboard': 'ડેશબોર્ડ',
      'scanInvoice': 'ઇન્વૉઇસ સ્કેન કરો (OCR)',
      'inventory': 'ઇન્વેન્ટરી',
      'alertsReorders': 'ચેતવણીઓ અને પુનઃ ઓર્ડર',
      'integration': 'એકીકરણ',
      'exportExcel': 'એક્સેલમાં નિકાસ કરો',
      'tallySync': 'ટેલી સિંક',
      'allDataSynced': 'બધો ડેટા સિંક થયો',
      'admin': 'વ્યવસ્થાપક',
      'inventoryOverview': 'ઇન્વેન્ટરી વિહંગાવલોકન',
      'smartExtraction': 'સ્માર્ટ નિષ્કર્ષણ અને સ્ટોક વ્યવસ્થાપન',
      'exportReport': 'રિપોર્ટ નિકાસ કરો',
      'scanNewInvoice': 'નવું ઇન્વૉઇસ સ્કેન કરો',
      'scanning': 'સ્કેન થઈ રહ્યું છે...',
      'totalItems': 'સ્ટોકમાં કુલ વસ્તુઓ',
      'fromRecentScans': 'તાજેતરના સ્કેનમાંથી',
      'lowStockAlerts': 'ઓછા સ્ટોક ચેતવણીઓ',
      'needsReordering': 'આજે પુનઃ ઓર્ડર કરવાની જરૂર છે',
      'invoicesScanned': 'સ્કેન કરેલા ઇન્વૉઇસ',
      'todayAccuracy': 'આજે, 98% ચોકસાઈ',
      'totalInventoryValue': 'કુલ ઇન્વેન્ટરી મૂલ્ય',
      'updatedMinsAgo': '5 મિનિટ પહેલાં અપડેટ થયું',
      'recentInvoiceScans': 'તાજેતરના ઇન્વૉઇસ સ્કેન (OCR)',
      'viewAll': 'બધું જુઓ',
      'vendorDate': 'વિક્રેતા / તારીખ',
      'status': 'સ્થિતિ',
      'itemsExtracted': 'કાઢેલી વસ્તુઓ',
      'amount': 'રકમ',
      'autoSynced': 'ઓટો-સિંક',
      'needsReview': 'સમીક્ષા જરૂરી',
      'lowStockAlertsTitle': 'ઓછા સ્ટોક ચેતવણીઓ',
      'productName': 'ઉત્પાદનનું નામ',
      'stockLeft': 'બાકી સ્ટોક',
      'min': 'ન્યૂનતમ',
      'units': 'એકમો',
      'noLowStock': 'ઓછા સ્ટોક વસ્તુઓ નથી',
      'generateReorderList': 'પુનઃ ઓર્ડર સૂચિ બનાવો',
      'processingInvoice': 'ઇન્વૉઇસ પ્રક્રિયા કરી રહ્યું છે...',
      'extractingItems': 'વસ્તુઓ કાઢી રહ્યું છે અને ટેલી સાથે સિંક કરી રહ્યું છે'
    }
  };

  private currentLangSubject = new BehaviorSubject<string>(
    localStorage.getItem('selectedLanguage') || 'en'
  );
  currentLang$ = this.currentLangSubject.asObservable();

  setLanguage(lang: string) {
    localStorage.setItem('selectedLanguage', lang);
    this.currentLangSubject.next(lang);
  }

  translate(key: string): string {
    const lang = this.currentLangSubject.value;
    return this.translations[lang]?.[key] || this.translations['en'][key] || key;
  }

  getCurrentLanguage(): string {
    return this.currentLangSubject.value;
  }
}

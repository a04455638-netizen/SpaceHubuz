export type Locale = "uz" | "ru" | "en";

export interface Translations {
  common: {
    brandName: string;
    tagline: string;
    search: string;
    filter: string;
    allCategories: string;
    viewDetails: string;
    bookNow: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    loading: string;
    error: string;
    noResults: string;
    pricePerHour: string;
    currency: string;
    language: string;
    theme: string;
    lightTheme: string;
    darkTheme: string;
  };
  nav: {
    explore: string;
    map: string;
    compare: string;
    aiAssistant: string;
    myBookings: string;
    favorites: string;
    profile: string;
    ownerPortal: string;
    adminPanel: string;
    signIn: string;
    signOut: string;
  };
  categories: {
    work: string;
    sports: string;
    meetings: string;
    events: string;
  };
  booking: {
    selectDateAndTime: string;
    duration: string;
    totalAmount: string;
    serviceFee: string;
    paymentMethod: string;
    payWithClick: string;
    payWithPayme: string;
    payOnArrival: string;
    confirmedSuccess: string;
    slotBookedWarning: string;
  };
}

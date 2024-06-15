declare interface Window {
    payfast_do_onsite_payment: (config: { uuid: string; return_url: string; cancel_url: string; }) => void;
  }
  